import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google"; 
import "./styles/globals.scss";
import BurgerMenu from "@/components/burgerMenu/BurgerMenu";
import Navbar from "@/components/navbar/Navbar";
import ToastProvider from '@/components/toast/ToastProvider';
import Footer from '@/components/footer/Footer';
import ConsoleEasterEgg from '@/components/ConsoleEasterEgg';

const bebasNeue = Bebas_Neue({ 
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Poglavlje Vlku",
  description: "Web shop i katalog knjiga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable}`}>
      <body>
        <ConsoleEasterEgg />
        <ToastProvider>
          <BurgerMenu />
          <Navbar />
          {children}
        </ToastProvider>
        <Footer />
      </body>
    </html>
  );
}