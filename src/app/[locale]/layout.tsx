import Header from "@/components/common/header/Header";
import { Providers } from "@/utils/service/TanstakProvider";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/common/footer/Footer";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ToastContainer } from 'react-toastify'
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

export const metadata: Metadata = {
  title: { template: "%s | پروژه مسکن", default: "پروژه مسکن" },
  description: " املاک دلتا دوست خوب بچه ها ",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`antialiased overflow-x-hidden custom-scrollbar`}
      >
        <div className="flex flex-col justify-between mx-auto max-w-[1750px] w-full h-screen">
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <Providers>
            <NextIntlClientProvider >
              <div className="px-8 w-full">
                <Header />
              </div>
              <div className="mb-[100px]">
                {children}
              </div>
              <div className="xl:px-8 px-0">
                <Footer />
              </div>
            </NextIntlClientProvider>
          </Providers>
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
