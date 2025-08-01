import { Card, Typography, Button, Space, Empty } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { redirect } from "next/navigation";
import postgres from "postgres";
import Link from "next/link";

const { Title, Text } = Typography;

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getAlbumInfo(code: string) {
  try {
    const albums = await sql`
      SELECT id, title, created_at
      FROM albums 
      WHERE id = ${code}
    `;

    if (albums.length === 0) {
      throw new Error("相冊不存在");
    }

    return albums[0];
  } catch (error) {
    throw error;
  }
}

async function getAlbumPhotos(code: string) {
  try {
    const photos = await sql`
      SELECT id, text, created_at
      FROM photos 
      WHERE album_id = ${code}
      ORDER BY created_at ASC
    `;

    return photos;
  } catch (error) {
    throw error;
  }
}

export default async function ViewAlbumPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  try {
    const [albumInfo, photos] = await Promise.all([
      getAlbumInfo(code),
      getAlbumPhotos(code),
    ]);

    return (
      <div style={{ maxWidth: 1000, margin: "50px auto", padding: "20px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <Space>
              <Link href={`/${code}`}>
                <Button icon={<ArrowLeftOutlined />}>返回相冊</Button>
              </Link>
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {albumInfo.title}
                </Title>
                <Text type="secondary">相冊代碼：{albumInfo.id}</Text>
              </div>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => (window.location.href = `/add-photo/${code}`)}
            >
              添加照片
            </Button>
          </div>

          {photos.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                maxWidth: "100%",
              }}
            >
              {photos.map((photo, index) => (
                <Card
                  key={photo.id}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: "16px",
                        textAlign: "center",
                      }}
                    >
                      {photo.text}
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        opacity: 0.8,
                        fontSize: "14px",
                      }}
                    >
                      {new Date(photo.created_at * 1000).toLocaleString(
                        "zh-TW",
                      )}
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "16px",
                        fontSize: "12px",
                        opacity: 0.6,
                      }}
                    >
                      #{index + 1}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty
              description="相冊中還沒有照片"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => (window.location.href = `/add-photo/${code}`)}
              >
                添加第一張照片
              </Button>
            </Empty>
          )}
        </Card>
      </div>
    );
  } catch (error: any) {
    console.error("Error loading album:", error.message);
    redirect("/");
  }
}
