import "antd/dist/reset.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("children", children);
  return <div>{children}</div>;
}
