"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Photo, Album } from "@/app/seed/placeholder-data";

export default function Page() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const params = useParams();
  const code = params.code;

  const fetchAlbum = async () => {
    const response = await fetch(`/api/album/${code}`);
    const data = await response.json();
    setAlbum(data);
  };
  const fetchPhotos = async () => {
    const response = await fetch(`/api/photo?albumId=${code}`);
    const data = await response.json();
    setPhotos(data);
  };

  useEffect(() => {
    fetchAlbum();
    fetchPhotos();
  }, [code]);
  return (
    <div>
      {album?.title}
      {photos.map((photo) => (
        <div key={photo.id}>{photo.text}</div>
      ))}
    </div>
  );
}
