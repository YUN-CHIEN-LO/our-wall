"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { encryptPasswordForAPI } from "@/utils/crypto";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [accountSubmitError, setAccountSubmitError] = useState<string>("");
  const [passwordSubmitError, setPasswordSubmitError] = useState<string>("");

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // 加密密碼
      const { encryptedPassword, salt } = encryptPasswordForAPI(
        values.password,
      );

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          encryptedPassword,
          salt,
        }),
      });

      if (response.ok) {
        message.success("登入成功");
        router.push("/");
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setPasswordSubmitError(errorData.error || "登入失敗");
        } else {
          setAccountSubmitError(errorData.error || "登入失敗");
        }
      }
    } catch (error) {
      setAccountSubmitError("登入失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto auto",
        padding: "20px",
      }}
    >
      <Card title="用戶登入" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            label="郵箱"
            validateStatus={accountSubmitError ? "error" : undefined}
            help={accountSubmitError}
            rules={[
              { required: true, message: "請輸入郵箱" },
              { type: "email", message: "請輸入有效的郵箱地址" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="請輸入郵箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密碼"
            validateStatus={passwordSubmitError ? "error" : undefined}
            help={passwordSubmitError}
            rules={[
              { required: true, message: "請輸入密碼" },
              { min: 6, message: "密碼至少 6 位" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請輸入密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              style={{ width: "100%" }}
            >
              登入
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            還沒有帳號？ <Link href="/register">立即註冊</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
