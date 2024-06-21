import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BINGANDO",
  description: "Youtube Video Comment Sentiment Explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.clame}>
        <Providers>
          {children}
          <ScrollToTopButton/>
        </Providers>
      </body>
    </html >
  );
}