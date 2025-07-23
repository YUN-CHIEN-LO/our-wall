import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;


    if (code && code.trim() !== "") {
      // 首先檢查表是否存在
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'albums'
        );
      `;

      if (!tableExists[0]?.exists) {
        return Response.json(
          {
            error: "Table not found",
            code: 500,
            message: "Albums table does not exist",
          },
          { status: 500 },
        );
      }

      // 檢查 id 字段是否存在
      const columnExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'albums' AND column_name = 'id'
        );
      `;

      if (!columnExists[0]?.exists) {
        return Response.json(
          {
            error: "Column not found",
            code: 500,
            message: "ID column does not exist in albums table",
          },
          { status: 500 },
        );
      }

      // 根據 ID 查詢特定專輯
      const album = await sql`SELECT * FROM albums WHERE id = ${code.trim()}`;

      if (album.length === 0) {
        return Response.json(
          {
            error: "Album not found",
            code: 404,
            message: `No album found with CODE: ${code}`,
          },
          { status: 404 },
        );
      }
      return Response.json(album[0]);
    } else {
      // 查詢所有專輯
      const albums = await sql`SELECT * FROM albums`;
      return Response.json(albums);
    }
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      {
        error: "Internal server error",
        code: 500,
        message:
          error instanceof Error ? error.message : "Database connection failed",
        details: error,
      },
      { status: 500 },
    );
  }
}
