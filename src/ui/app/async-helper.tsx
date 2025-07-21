export const fetchAlbum = async (code: string) => {
  const response = await fetch(`/api/album/${code}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
