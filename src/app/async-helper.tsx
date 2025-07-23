export async function fetchAlbum(code: string) {
  const response = await fetch(`/api/album/${code}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "獲取相冊失敗");
  }

  const data = await response.json();
  return { id: data.id };
}
