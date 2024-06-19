import Providers from "./components/Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import AppBar from "./components/AppBar";
import BackgroundGradientAnimation from "./components/BackGroundGradientAnimation";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YVCSE",
  description: "Youtube Video Comment Sentiment Explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.clame}>
        <Providers>
          <AppBar />
          <div className="container mx-auto relative flex flex-row justify-between items-center px-4 py-2 z-50">
          {children}
          </div>
          <BackgroundGradientAnimation />
        </Providers>
      </body>
    </html>
  );
}