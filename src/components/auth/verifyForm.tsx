/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { ChevronLeft, Loader, RefreshCcw } from "lucide-react";
import CommonButton from "../common/buttons/common/CommonButton";
import { useForm } from "react-hook-form";
import { showToast } from "@/core/toast/toast";
import { useState } from "react";
import axiosApi from "@/core/interceptore/axiosApi";
import { redirect, useRouter } from "next/navigation";
import OtpInput from "../common/inputs/auth/OtpInput";
import TimerButton from "../common/buttons/timer/TimerButton";
import { useUserStore } from "@/utils/zustand/store";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";

const VerifyForm = () => {
  const t = useTranslations("auth.verifyForm");
  const dir = useDirection();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>();
  const tempUserId = useUserStore((state) => state.tempUserId);
  const setUserId = useUserStore((state) => state.setUserId);
  const router = useRouter();

  const { handleSubmit, reset } = useForm({});

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const data = {
        tempUserId: Number(tempUserId),
        verificationCode: code,
      };
      const res = (await axiosApi.post("/auth/verify-email", data)) as any;

      if (res.userId) {
        setUserId(res.userId);
      }

      if (res) {
        showToast(
          "success",
          t("successTitle"),
          t("close"),
          t("successMessage")
        );
        setIsLoading(false);
        reset();
        router.push("/completeRegister");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        showToast(
          "error",
          t("errorTitle"),
          t("close"),
          error.response.data.message,
          5000
        );
      } else {
        showToast(
          "error",
          t("errorTitle"),
          t("close"),
          t("errorMessage"),
          5000
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir}>
      <form className="mt-8 space-y-10" onSubmit={handleSubmit(handleRegister)}>
        <div className="flex flex-col gap-4">
          <div className="w-full flex xl:flex-row flex-col xl:gap-4 gap-8 justify-between xl:items-center items-start text-card-foreground">
            <OtpInput onchange={(e) => setCode(e)} />
            <TimerButton
              classname="flex-row"
              onclick={async () => {
                try {
                  const data = {
                    tempUserId: Number(tempUserId),
                    verificationCode: code,
                  };
                  const res = (await axiosApi.post(
                    "/auth/verify-email",
                    data
                  )) as any;

                  if (res.userId) {
                    setUserId(res.userId);
                  }

                  if (res) {
                    showToast(
                      "success",
                      t("successTitle"),
                      t("close"),
                      t("successMessage")
                    );
                    setIsLoading(false);
                    reset();
                    router.push("/completeRegister");
                  }
                } catch (error: any) {
                  if (error.response?.data?.message) {
                    showToast(
                      "error",
                      t("errorTitle"),
                      t("close"),
                      error.response.data.message,
                      5000
                    );
                  } else {
                    showToast(
                      "error",
                      t("errorTitle"),
                      t("close"),
                      t("errorMessage"),
                      5000
                    );
                  }
                  setIsLoading(false);
                }
              }}
            />
          </div>
        </div>

        <div className="flex flex-row-reverse gap-4 md:flex-nowrap flex-wrap">
          <CommonButton
            type="submit"
            title={isLoading ? t("loading") : t("submit")}
            icon={isLoading ? <Loader /> : <ChevronLeft size={16} />}
            classname="md:w-1/2 w-full text-primary-foreground"
          />
          <CommonButton
            type="button"
            title={t("changeEmail")}
            onclick={() => redirect("/login")}
            icon={<RefreshCcw size={16} />}
            classname="bg-transparent border border-card-foreground text-card-foreground md:w-1/2 w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default VerifyForm;
