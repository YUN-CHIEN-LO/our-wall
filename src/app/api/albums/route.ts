import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    let albums;

    if (userId) {
      // 查詢特定用戶的相冊
      albums = await sql`
        SELECT id, title, created_at
        FROM albums 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
    } else {
      // 查詢所有相冊
      albums = await sql`
        SELECT id, title, created_at
        FROM albums 
        ORDER BY created_at DESC
      `;
    }

    // 轉換 BigInt 為數字以確保 JSON 序列化
    const serializedAlbums = albums.map(album => ({
      id: album.id,
      title: album.title,
      created_at: Number(album.created_at)
    }));

    return NextResponse.json(serializedAlbums);
  } catch (error) {
    console.error("Get user albums error:", error);
    return NextResponse.json(
      { error: "獲取相冊列表失敗" },
      { status: 500 }
    );
  }
}