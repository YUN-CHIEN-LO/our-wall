import { Card, Descriptions } from "antd";
import { redirect } from "next/navigation";

async function getAlbumInfo(code: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/album/${code}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "獲取相冊信息失敗");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  try {
    const albumInfo = await getAlbumInfo(code);

    return (
      <div style={{ maxWidth: 800, margin: "50px auto", padding: "20px" }}>
        <Card title="相冊信息" style={{ marginBottom: "20px" }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="代碼">{albumInfo.id}</Descriptions.Item>
            <Descriptions.Item label="標題">
              {albumInfo.title}
            </Descriptions.Item>
            <Descriptions.Item label="用戶ID">
              {albumInfo.user_id}
            </Descriptions.Item>
            <Descriptions.Item label="創建時間">
              {new Date(albumInfo.created_at * 1000).toLocaleString("zh-TW")}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  } catch (error: any) {
    redirect("/");
  }
}
