import bcrypt from "bcrypt";
import postgres from "postgres";

import { users, albums, photos } from "./placeholder-data";

const formatTimestamp = (timestamp: number) => {
  return Math.floor(timestamp / 1000);
};

async function seedUsers(sql: postgres.Sql) {
  await sql`DROP TABLE IF EXISTS users CASCADE;`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT)
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, created_at)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${formatTimestamp(user.createdAt)})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedAlbums(sql: postgres.Sql) {
  await sql`DROP TABLE IF EXISTS albums CASCADE;`;

  await sql`
    CREATE TABLE IF NOT EXISTS albums (
      id VARCHAR(6) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      user_id UUID NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT)
    );
  `;

  const insertedAlbums = await Promise.all(
    albums.map(async (album) => {
      return sql`
        INSERT INTO albums (id, title, user_id, created_at)
        VALUES (${album.id}, ${album.title}, ${album.userId}, ${formatTimestamp(album.createdAt)})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedAlbums;
}

async function seedPhotos(sql: postgres.Sql) {
  await sql`DROP TABLE IF EXISTS photos CASCADE;`;

  await sql`
    CREATE TABLE IF NOT EXISTS photos (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      text TEXT NOT NULL,
      album_id VARCHAR(6) NOT NULL,
      FOREIGN KEY (album_id) REFERENCES albums(id),
      created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT)
    );
  `;

  const insertedPhotos = await Promise.all(
    photos.map(async (photo) => {
      return sql`
        INSERT INTO photos (id, text, album_id, created_at) 
        VALUES (${photo.id}, ${photo.text}, ${photo.albumId}, ${formatTimestamp(photo.createdAt)}) ON CONFLICT (id) DO NOTHING;
          `;
    }),
  );

  return insertedPhotos;
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    await sql.begin(async (tx: postgres.Sql) => {
      await seedUsers(tx);
      await seedAlbums(tx);
      await seedPhotos(tx);
    });

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
