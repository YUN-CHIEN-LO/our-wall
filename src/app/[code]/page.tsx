"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const code = params.code;
  console.log(code);
  return <div>{code}</div>;
}
