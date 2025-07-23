"use client";
import { Button } from "antd";
import { redirect } from "next/navigation";

export default function CreateAlbumBtn() {
  return (
    <Button type="primary" onClick={() => redirect("/create-album")}>
      創建相冊
    </Button>
  );
}
