"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { fetchAlbum } from "@ui/app/async-helper";

export default function Entry() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { code: string }) => {
    const code = values.code;

    if (code.length !== 6) {
      message.error("請輸入 6 位數字");
      return;
    }

    setIsLoading(true);
    try {
      const { id } = await fetchAlbum(code);
      router.push(`/${id}`);
    } catch (error: any) {
      console.warn(error.message);
      message.error("代碼無效，請重新輸入");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        請輸入 6 位數字代碼
      </h2>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="code"
          label="代碼"
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
    </div>
  );
}
