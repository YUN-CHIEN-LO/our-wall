import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albumId = searchParams.get("albumId");

  if (!albumId) {
    return Response.json({ error: "Album ID is required" }, { status: 400 });
  }

  const photos = await sql`
    SELECT * FROM photos 
    WHERE album_id = ${albumId}
    ORDER BY created_at ASC
  `;

  return Response.json(photos);
}
