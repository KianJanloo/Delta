/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { ArrowLeft, Eye, EyeOff, Loader } from "lucide-react";
import CommonButton from "../common/buttons/common/CommonButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLoginValidation } from "@/utils/validations/login-validation";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { showToast } from "@/core/toast/toast";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { fetchApi } from "@/core/interceptore/fetchApi";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const LoginForm = () => {
  const t = useTranslations("auth.loginForm");
  const dir = useDirection();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaLoginValidation),
  });

  const handleLogin = async (values: any) => {
    setIsLoading(true);

    if (!recaptchaRef.current) return;

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    const response = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        email: values.email,
      }),
    });

    if (response.ok) {
      const user = (await fetchApi.post("/auth/login", {
        email: values.email,
        password: values.password,
      })) as any;

      let decoded: any = null;

      if (user?.accessToken) {
        decoded = jwtDecode(user.accessToken);
      }

      const res = await signIn("credentials", {
        redirect: false,
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken,
        password: values.password,
      });

      setIsLoading(false);

      if (res?.ok) {
        showToast("success", t("successTitle"), t("close"), "");
        reset();
        if (decoded?.role === "seller") {
          redirect("/dashboard/seller");
        } else if (decoded?.role === "buyer") {
          redirect("/dashboard");
        }
      }
    } else {
      showToast("error", " reCaptCHA failed, please try again.");
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <div dir={dir}>
      <form
        className="mt-8 space-y-6 text-foreground"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="rounded-md -space-y-px flex md:flex-nowrap flex-wrap gap-4">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            size="invisible"
            ref={recaptchaRef}
          />
          <div className="md:w-1/2 w-full flex gap-1 flex-col text-card-foreground">
            <Label htmlFor="email" className={`text-[13px] flex gap-0.5`}>
              <span>{t("email")}</span>
              <p className="text-danger"> * </p>
              <span> : </span>
            </Label>
            <Input
              id="email"
              type="text"
              className="bg-transparent placeholder:text-card-foreground text-sm outline-none w-full py-3 border border-card-foreground text-card-foreground px-4 rounded-[16px] text-[16px]"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger text-sm font-semibold">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 md:w-1/2 w-full">
            <div className="w-full flex gap-1 flex-col text-card-foreground">
              <Label htmlFor="password" className={`text-[13px] flex gap-0.5`}>
                <span>{t("password")}</span>
                <p className="text-danger"> * </p>
                <span> : </span>
              </Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "password" : "text"}
                  className="bg-transparent placeholder:text-card-foreground text-sm outline-none w-full py-3 border border-card-foreground text-card-foreground px-4 rounded-[16px] text-[16px]"
                  {...register("password")}
                />
                <Button
                  variant={"scale"}
                  onClick={() => setShowPassword(!showPassword)}
                  className={`cursor-pointer bg-transparent text-card-foreground absolute top-2 ${
                    dir === "rtl" ? "left-3" : "right-3"
                  } `}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className={`size-[20px]`} />
                  ) : (
                    <Eye className={`size-[20px]`} />
                  )}
                </Button>
                <div />
                {errors.password && (
                  <p className="text-danger text-sm mt-0.5 font-semibold">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <span className="text-card-foreground flex gap-2 text-sm cursor-pointer">
                <p>{t("forgotPassword")}</p>{" "}
                <ArrowLeft
                  className={` ${dir === "ltr" && "rotate-180"} `}
                  size={20}
                />
              </span>
            </div>
          </div>
        </div>
        <div>
          <CommonButton
            type="submit"
            title={isLoading ? t("loading") : t("submit")}
            icon={isLoading ? <Loader /> : <ArrowLeft size={16} />}
            classname="w-full text-primary-foreground"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
