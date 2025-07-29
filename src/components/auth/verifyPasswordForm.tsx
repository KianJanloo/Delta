"use client";

import { showToast } from "@/core/toast/toast";
import { verifyRequest } from "@/utils/service/api/forget-password/verifyRequest";
import { useCodeStore, useEmailStore } from "@/utils/zustand/store";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "../common/inputs/auth/OtpInput";
import TimerButton from "../common/buttons/timer/TimerButton";
import CommonButton from "../common/buttons/common/CommonButton";
import { ChevronLeft, Loader, RefreshCcw } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

const VerifyPasswordForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCodee] = useState<string>();
  const router = useRouter();
  const { email } = useEmailStore();
  const { setCode } = useCodeStore();

  const { handleSubmit, reset } = useForm({});

  const handleVerify = async () => {
    setIsLoading(true);

    let data = {
      email: "",
      resetCode: "",
    };

    if (code && email) {
      data = {
        resetCode: code,
        email: email,
      };
    }

    const res = await verifyRequest(data);

    if (res && code) {
      console.log(code);
      setCode(code);

      showToast("success", " کد تایید شد. ");
      setIsLoading(false);
      reset();
      router.push("/forget-password/reset");
    } else {
      showToast("error", " کد تایید صحیح نمی باشد. ");
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div>
      <form className="mt-8 space-y-10" onSubmit={handleSubmit(handleVerify)}>
        <div className="flex flex-col gap-4">
          <div className="w-full flex xl:flex-row flex-col xl:gap-4 gap-8 justify-between xl:items-center items-start text-card-foreground">
            <OtpInput onchange={(e) => setCodee(e)} />
            <TimerButton
              classname="flex-row"
              onclick={async () => {
                setIsLoading(true);

                let data = {
                  email: "",
                  resetCode: "",
                };

                if (code && email) {
                  data = {
                    resetCode: code,
                    email: email,
                  };
                }

                console.log(data);

                const res = await verifyRequest(data);

                if (res && code) {
                  setCode(code);

                  showToast("success", " کد تایید شد. ");
                  setIsLoading(false);
                  reset();
                  router.push("/forget-password/reset");
                } else {
                  showToast("error", " کد تایید صحیح نمی باشد. ");
                  setIsLoading(false);
                  reset();
                }
              }}
            />
          </div>
        </div>

        <div className="flex flex-row-reverse gap-4 md:flex-nowrap flex-wrap">
          <CommonButton
            type="submit"
            title={isLoading ? " در حال ثبت " : " ثبت کد "}
            icon={isLoading ? <Loader /> : <ChevronLeft size={16} />}
            classname="md:w-1/2 w-full text-primary-foreground"
          />
          <CommonButton
            type="button"
            title={" تغییر ایمیل "}
            onclick={() => redirect("/forget-password/send")}
            icon={<RefreshCcw size={16} />}
            classname="bg-transparent border border-card-foreground text-card-foreground md:w-1/2 w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default VerifyPasswordForm;
