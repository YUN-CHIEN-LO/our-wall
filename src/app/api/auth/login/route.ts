import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import postgres from "postgres";
import { cookies } from "next/headers";
import { decryptPassword, validateEncryptedPassword } from "@/utils/server-crypto";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: NextRequest) {
  try {
    const { email, encryptedPassword, salt } = await request.json();

    if (!email || !encryptedPassword || !salt) {
      return NextResponse.json(
        { error: "請提供郵箱和密碼" },
        { status: 400 }
      );
    }

    // 驗證加密密碼格式
    if (!validateEncryptedPassword(encryptedPassword, salt)) {
      return NextResponse.json(
        { error: "密碼格式無效" },
        { status: 400 }
      );
    }

    // 解密密碼
    const password = decryptPassword(encryptedPassword, salt);

    // 查詢用戶
    const users = await sql`
      SELECT id, name, email, password 
      FROM users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "用戶不存在" },
        { status: 404 }
      );
    }

    const user = users[0];

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "密碼錯誤" },
        { status: 401 }
      );
    }

    // 設置 cookie
    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "登入失敗" },
      { status: 500 }
    );
  }
} 