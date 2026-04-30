import type {Metadata} from "next";

export const metadata: Metadata = {
  title: {
    default: "MiniLink | Rút Gọn Link Nhanh Chóng & An Toàn",
    template: "%s | MiniLink",
  },
  description: "Dịch vụ rút gọn link chuyên nghiệp, giúp bạn quản lý liên kết hiệu quả, theo dõi lượt click và tối ưu hóa hiện diện trực tuyến.",
  keywords: ["rút gọn link", "shorten url", "minilink", "quản lý liên kết", "analytics", "link bio"],
  authors: [{ name: "MiniLink Team" }],
  creator: "MiniLink Team",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://minilink.vn",
    title: "MiniLink | Rút Gọn Link Nhanh Chóng & An Toàn",
    description: "Dịch vụ rút gọn link chuyên nghiệp, giúp bạn quản lý liên kết hiệu quả.",
    siteName: "MiniLink",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "MiniLink Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiniLink | Rút Gọn Link Nhanh Chóng & An Toàn",
    description: "Dịch vụ rút gọn link chuyên nghiệp, giúp bạn quản lý liên kết hiệu quả.",
    images: ["/hero.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};
