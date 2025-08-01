"use client";

import { useState } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { TextArea } = Input;

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function AddPhotoPage({ params }: PageProps) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { text: string }) => {
    setIsLoading(true);
    try {
      const { code } = await params;

      const response = await fetch(`/api/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: code,
          text: values.text,
        }),
      });

      if (response.ok) {
        message.success("照片添加成功！");
        router.push(`/${code}`);
      } else {
        const error = await response.json();
        message.error(error.error || "添加照片失敗");
      }
    } catch (error) {
      console.error("Add photo error:", error);
      message.error("添加照片失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: "20px" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>
          添加照片
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="照片描述"
            name="text"
            rules={[
              { required: true, message: "請輸入照片描述" },
              { max: 500, message: "描述不能超過500個字符" },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="請描述這張照片..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              添加照片
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
