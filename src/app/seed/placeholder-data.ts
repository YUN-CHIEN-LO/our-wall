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
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Chien",
    email: "chien@example.com",
    password: "123456",
    createdAt: 1753114963185,
  },
];

const albums: Album[] = [
  {
    id: "080816",
    title: "BeeBay",
    userId: "410544b2-4001-4271-9855-fec4b6a6442a",
    createdAt: 1753114963185,
  },
];

const photos: Photo[] = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    text: "Today is a good day",
    albumId: "080816",
    createdAt: 1753114963185,
  },
  {
    id: "410544b2-4001-4271-9856-fec4b6a6442b",
    text: "Today is a bad day",
    albumId: "080816",
    createdAt: 1753114963185,
  },
];

export { users, albums, photos };
