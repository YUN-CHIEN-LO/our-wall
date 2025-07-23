"use client";

import { useState, useEffect } from "react";
import { Layout, Button, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 檢查用戶是否已登入
    checkAuthStatus();
  }, [pathname]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    // 重定向到登入頁面或打開登入模態框
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <Header style={{ background: "#fff", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              相冊系統
            </Typography.Title>
          </Link>
        </div>
      </Header>
    );
  }

  return (
    <Header style={{ background: "#fff", padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            相冊系統
          </Typography.Title>
        </Link>

        <Space>
          {user ? (
            <>
              <Space>
                <UserOutlined />
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/${user.id}`)}
                >
                  {user.name}
                </Text>
              </Space>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                登出
              </Button>
            </>
          ) : (
            <>
              <Button type="text" onClick={handleLogin}>
                登入
              </Button>
              <Button type="primary" onClick={() => router.push("/register")}>
                註冊
              </Button>
            </>
          )}
        </Space>
      </div>
    </Header>
  );
}
