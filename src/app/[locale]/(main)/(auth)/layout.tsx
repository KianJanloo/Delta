import AuthContainer from "@/components/auth/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود یا ثبت‌نام ",
  description: "به حساب کاربری خود وارد شوید یا یک حساب جدید ایجاد کنید.",
  keywords: ["ورود", "ثبت‌ نام", "دلتا", "احراز هویت"],
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthContainer>{children}</AuthContainer>
    </div>
  );
}
