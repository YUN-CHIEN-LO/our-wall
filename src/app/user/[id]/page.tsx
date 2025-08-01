"use client";

import { useState, useEffect, use } from "react";
import { Card, List, Space, Empty, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateAlbumBtn from "./create-album-btn";

interface Album {
  id: string;
  title: string;
  created_at: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  created_at: number;
}

async function getUserInfo(userId: string): Promise<UserInfo> {
  try {
    const response = await fetch(`/api/user/${userId}`);

    if (!response.ok) {
      throw new Error("無法獲取用戶信息");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function getUserAlbums(userId: string): Promise<Album[]> {
  try {
    const response = await fetch(`/api/albums?userId=${userId}`);

    if (!response.ok) {
      throw new Error("無法獲取相冊列表");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, albumsData] = await Promise.all([
          getUserInfo(id),
          getUserAlbums(id),
        ]);

        setUserInfo(userData);
        setAlbums(albumsData);
      } catch (error: any) {
        setError(error.message);
        console.error("Error loading user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div
        style={{ margin: "50px auto", padding: "20px", textAlign: "center" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div
        style={{ margin: "50px auto", padding: "20px", textAlign: "center" }}
      >
        <p>載入失敗，正在返回首頁...</p>
      </div>
    );
  }

  return (
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
          renderItem={(album: Album) => (
            <List.Item>
              <Card
                hoverable
                style={{ height: "100%" }}
                actions={[
                  <Link key="view" href={`/${album.id}`}>
                    查看
                  </Link>,
                  <Link key="edit" href={`/${album.id}/edit`}>
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
                        {new Date(album.created_at * 1000).toLocaleDateString(
                          "zh-TW",
                        )}
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
        <Empty description="還沒有相冊" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <CreateAlbumBtn />
        </Empty>
      )}
    </Card>
  );
}
