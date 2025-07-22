export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  console.log(code);
  return <div>{code}</div>;
}
