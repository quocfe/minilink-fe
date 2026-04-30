import {Inter} from "next/font/google";
import {cookies} from "next/headers";
import "./globals.css";
import {Providers} from "./providers";
export {metadata} from "./metadata";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialAuth = cookieStore.has("access_token");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers initialAuth={initialAuth}>{children}</Providers>
      </body>
    </html>
  );
}
