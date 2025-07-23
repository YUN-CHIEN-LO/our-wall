import { Card, List, Typography, Button, Space, Empty } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import postgres from "postgres";
import CreateAlbumBtn from "./create-album-btn";

const { Title, Text } = Typography;

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

interface Album {
  id: string;
  title: string;
  created_at: number;
}

async function getUserInfo(userId: string) {
  try {
    const users = await sql`
      SELECT id, name, email, created_at
      FROM users 
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      throw new Error("用戶不存在");
    }

    return users[0];
  } catch (error) {
    throw error;
  }
}

async function getUserAlbums(userId: string): Promise<Album[]> {
  try {
    const albums = await sql`
      SELECT id, title, created_at
      FROM albums 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return albums as unknown as Album[];
  } catch (error) {
    throw error;
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [userInfo, albums] = await Promise.all([
      getUserInfo(id),
      getUserAlbums(id),
    ]);

    return (
      <div style={{ margin: "50px auto", padding: "20px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "20px",
            }}
          >
            <Space>
              <UserOutlined style={{ fontSize: "24px" }} />
              <div>
                <h3 style={{ margin: 0 }}>{userInfo.name}</h3>
                <p>{userInfo.email}</p>
              </div>
            </Space>
            <CreateAlbumBtn />
          </div>

          <h2 style={{ marginBottom: "20px" }}>我的相冊</h2>

          {albums.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              dataSource={albums}
              renderItem={(album) => (
                <List.Item>
                  <Card
                    hoverable
                    style={{ height: "100%" }}
                    actions={[
                      <Link key="view" href={`/${album.id}`}>
                        查看
                      </Link>,
                      <Link key="edit" href={`/edit-album/${album.id}`}>
                        編輯
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      title={album.title}
                      description={
                        <div>
                          <p>
                            創建時間：
                            {new Date(
                              album.created_at * 1000,
                            ).toLocaleDateString("zh-TW")}
                          </p>
                          <br />
                          <p>相冊代碼：{album.id}</p>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description="還沒有相冊"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <CreateAlbumBtn />
            </Empty>
          )}
        </Card>
      </div>
    );
  } catch (error: any) {
    console.error("Error loading user albums:", error.message);
    redirect("/");
  }
}
