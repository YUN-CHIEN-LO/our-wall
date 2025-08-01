"use client";

import { useState } from "react";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";

async function fetchAlbum(code: string) {
  const response = await fetch(`/api/albums/${code}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "獲取相冊失敗");
  }

  const data = await response.json();
  return { id: data.id };
}

export default function Entry() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitError, setSubmitError] = useState<string>("");

  const handleSubmit = async (values: { code: string }) => {
    const code = values.code;
    setSubmitError("");

    if (code.length !== 6) {
      setSubmitError("請輸入 6 位數字");
      return;
    }

    setIsLoading(true);
    try {
      const { id } = await fetchAlbum(code);
      router.push(`/${id}`);
    } catch (error: any) {
      console.warn(error.message);
      setSubmitError("代碼無效，請重新輸入");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="code"
        label="代碼"
        validateStatus={submitError ? "error" : undefined}
        help={submitError}
        rules={[
          { required: true, message: "請輸入代碼" },
          {
            pattern: /^\d{6}$/,
            message: "請輸入 6 位數字",
          },
        ]}
      >
        <Input
          style={{ width: "100%" }}
          placeholder="請輸入 6 位數字"
          maxLength={6}
          size="large"
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Delete" &&
              e.key !== "Tab" &&
              e.key !== "ArrowLeft" &&
              e.key !== "ArrowRight"
            ) {
              e.preventDefault();
            }
          }}
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
          確認
        </Button>
      </Form.Item>
    </Form>
  );
}
