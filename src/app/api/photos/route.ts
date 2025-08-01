import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      );
    }

    const { albumId, text } = await request.json();

    if (!albumId || !text) {
      return NextResponse.json(
        { error: "請提供相冊ID和照片描述" },
        { status: 400 }
      );
    }

    // 檢查相冊是否存在
    const albums = await sql`
      SELECT id FROM albums WHERE id = ${albumId}
    `;

    if (albums.length === 0) {
      return NextResponse.json(
        { error: "相冊不存在" },
        { status: 404 }
      );
    }

    // 添加照片
    const photos = await sql`
      INSERT INTO photos (album_id, text, created_at)
      VALUES (${albumId}, ${text}, EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT)
      RETURNING id, text, created_at
    `;

    const photo = photos[0];

    // 轉換 BigInt 為數字以確保 JSON 序列化
    const serializedPhoto = {
      id: photo.id,
      text: photo.text,
      created_at: Number(photo.created_at)
    };

    return NextResponse.json(serializedPhoto, { status: 201 });
  } catch (error) {
    console.error("Add photo error:", error);
    return NextResponse.json(
      { error: "添加照片失敗" },
      { status: 500 }
    );
  }
} 