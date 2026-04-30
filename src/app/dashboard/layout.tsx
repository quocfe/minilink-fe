import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Quản lý và theo dõi các liên kết rút gọn của bạn.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
  // reload
}
