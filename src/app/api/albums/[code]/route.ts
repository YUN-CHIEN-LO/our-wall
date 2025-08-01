import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { error: "請提供相冊代碼" },
        { status: 400 }
      );
    }

    const albums = await sql`
      SELECT id, title, created_at
      FROM albums 
      WHERE id = ${code}
    `;

    if (albums.length === 0) {
      return NextResponse.json(
        { error: "相冊不存在" },
        { status: 404 }
      );
    }

    const album = albums[0];

    // 轉換 BigInt 為字符串以確保 JSON 序列化
    const serializedAlbum = {
      id: album.id,
      title: album.title,
      created_at: Number(album.created_at)
    };

    return NextResponse.json(serializedAlbum);
  } catch (error) {
    console.error("Get album error:", error);
    return NextResponse.json(
      { error: "獲取相冊失敗" },
      { status: 500 }
    );
  }
}