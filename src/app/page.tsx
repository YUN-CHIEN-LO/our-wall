import Entry from "./entry";

export default async function Home() {
  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        請輸入 6 位數字代碼
      </h2>
      <Entry />
    </div>
  );
}
