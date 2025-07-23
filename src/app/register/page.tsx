"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { encryptPasswordForAPI, validatePassword } from "@/utils/crypto";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [accountSubmitError, setAccountSubmitError] = useState<string>("");
  const [passwordSubmitError, setPasswordSubmitError] = useState<string>("");

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setAccountSubmitError("");
    setPasswordSubmitError("");

    if (values.password !== values.confirmPassword) {
      setPasswordSubmitError("密碼不一致");
      return;
    }

    // 驗證密碼強度
    const passwordValidation = validatePassword(values.password);
    if (!passwordValidation.isValid) {
      setPasswordSubmitError(passwordValidation.errors.join(", "));
      return;
    }

    setIsLoading(true);
    try {
      // 加密密碼
      const { encryptedPassword, salt } = encryptPasswordForAPI(
        values.password,
      );

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          encryptedPassword,
          salt,
        }),
      });

      if (response.ok) {
        message.success("註冊成功！請登入");
        router.push("/login");
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setAccountSubmitError(errorData.error || "註冊失敗");
        } else {
          setAccountSubmitError(errorData.error || "註冊失敗");
        }
      }
    } catch (error) {
      setAccountSubmitError("註冊失敗，請稍後再試");
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
      <Card title="用戶註冊" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            validateStatus={accountSubmitError ? "error" : undefined}
            help={accountSubmitError}
            rules={[
              { required: true, message: "請輸入姓名" },
              { min: 2, message: "姓名至少 2 個字符" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="請輸入姓名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="郵箱"
            rules={[
              { required: true, message: "請輸入郵箱" },
              { type: "email", message: "請輸入有效的郵箱地址" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
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

          <Form.Item
            name="confirmPassword"
            label="確認密碼"
            rules={[{ required: true, message: "請確認密碼" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請再次輸入密碼"
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
              註冊
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            已有帳號？ <Link href="/login">立即登入</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
