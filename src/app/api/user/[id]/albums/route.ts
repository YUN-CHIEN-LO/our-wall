import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 查詢用戶的相冊
    const albums = await sql`
      SELECT id, title, created_at
      FROM albums 
      WHERE user_id = ${id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Get user albums error:", error);
    return NextResponse.json(
      { error: "獲取相冊列表失敗" },
      { status: 500 }
    );
  }
} 