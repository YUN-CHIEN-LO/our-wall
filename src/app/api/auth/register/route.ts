import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import postgres from "postgres";
import { decryptPassword, validateEncryptedPassword } from "@/utils/server-crypto";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: NextRequest) {
  try {
    const { name, email, encryptedPassword, salt } = await request.json();

    if (!name || !email || !encryptedPassword || !salt) {
      return NextResponse.json(
        { error: "請提供完整的註冊信息" },
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密碼至少 6 位" },
        { status: 400 }
      );
    }

    // 檢查郵箱是否已存在
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "此郵箱已被註冊" },
        { status: 409 }
      );
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建新用戶
    const newUser = await sql`
      INSERT INTO users (name, email, password, created_at)
      VALUES (${name}, ${email}, ${hashedPassword}, EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT)
      RETURNING id, name, email
    `;

    return NextResponse.json({
      id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "註冊失敗" },
      { status: 500 }
    );
  }
} 