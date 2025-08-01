import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 查詢用戶信息
    const users = await sql`
      SELECT id, name, email, created_at
      FROM users 
      WHERE id = ${id}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "用戶不存在" },
        { status: 404 }
      );
    }

    const user = users[0];

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: Number(user.created_at),
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "獲取用戶信息失敗" },
      { status: 500 }
    );
  }
} 