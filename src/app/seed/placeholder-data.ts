export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
};

export type Album = {
  id: string;
  title: string;
  userId: string;
  createdAt: number;
};

export type Photo = {
  id: string;
  albumId: string;
  text: string;
  createdAt: number;
};

const users: User[] = [

];

const albums: Album[] = [

];

const photos: Photo[] = [

];

export { users, albums, photos };
