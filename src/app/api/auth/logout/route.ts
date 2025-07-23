import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // 清除用戶 cookie
    cookieStore.delete("user_id");

    return NextResponse.json({ message: "登出成功" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "登出失敗" },
      { status: 500 }
    );
  }
} 