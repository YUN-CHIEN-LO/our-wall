"use client";

import { useState, useEffect } from "react";
import { Card, Empty, Button, Space, Typography } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter, redirect } from "next/navigation";
import postgres from "postgres";

const { Title, Text } = Typography;

interface AlbumInfo {
  id: string;
  title: string;
  created_at: number;
}

interface Photo {
  id: string;
  text: string;
  created_at: number;
}

interface PageProps {
  albumInfo: AlbumInfo;
  photos: Photo[];
  code: string;
}

function AlbumPage({ albumInfo, photos, code }: PageProps) {
  const [showNavbar, setShowNavbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClick = () => {
      setShowNavbar(true);
      // 3秒後自動隱藏
      setTimeout(() => setShowNavbar(false), 3000);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleViewAlbum = () => {
    router.push(`/view/${code}`);
  };

  const handleAddPhoto = () => {
    router.push(`/add-photo/${code}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", padding: "20px" }}>
      {/* 導航欄 - 條件顯示 */}
      {showNavbar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #f0f0f0",
            padding: "10px 20px",
            zIndex: 1000,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {albumInfo.title}
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={handleViewAlbum}
              >
                檢視相冊
              </Button>
              <Button icon={<PlusOutlined />} onClick={handleAddPhoto}>
                添加照片
              </Button>
            </Space>
          </div>
        </div>
      )}

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {albumInfo.title}
            </Title>
            <Text type="secondary">相冊代碼：{albumInfo.id}</Text>
          </div>
        </div>

        <Title level={4}>相冊內容</Title>

        {photos.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {photos.map((photo) => (
              <Card key={photo.id} size="small">
                <div>
                  <p style={{ margin: "0 0 8px 0" }}>{photo.text}</p>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {new Date(photo.created_at * 1000).toLocaleString("zh-TW")}
                  </Text>
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
              onClick={handleAddPhoto}
            >
              添加第一張照片
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
}

// 服務器組件
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

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export default async function Page({
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

    return <AlbumPage albumInfo={albumInfo} photos={photos} code={code} />;
  } catch (error: any) {
    console.error("Error loading album:", error.message);
    redirect("/");
  }
}
