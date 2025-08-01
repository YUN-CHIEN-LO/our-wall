import { Card, Descriptions } from "antd";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  try {
    const album = await sql`
      SELECT id, title, user_id, created_at
      FROM albums 
      WHERE id = ${code}
    `;

    if (album.length === 0) {
      redirect("/");
    }

    const [albumInfo] = album;

    return (
      <div style={{ maxWidth: 800, margin: "50px auto", padding: "20px" }}>
        <Card title="相冊信息" style={{ marginBottom: "20px" }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="代碼">{albumInfo.id}</Descriptions.Item>
            <Descriptions.Item label="標題">
              {albumInfo.title}
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
