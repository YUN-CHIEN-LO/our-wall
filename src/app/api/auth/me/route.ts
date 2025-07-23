import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { cookies } from "next/headers";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    // 查詢用戶信息
    const users = await sql`
      SELECT id, name, email 
      FROM users 
      WHERE id = ${userId.value}
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
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "獲取用戶信息失敗" },
      { status: 500 }
    );
  }
} 