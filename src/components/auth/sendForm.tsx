"use client";

import { showToast } from "@/core/toast/toast";
import { sendCodePassword } from "@/utils/service/api/forget-password/sendCodePassword";
import { SendPasswordValidation } from "@/utils/validations/send-form-validations";
import { useEmailStore } from "@/utils/zustand/store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import CommonButton from "../common/buttons/common/CommonButton";
import { ChevronLeft, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const SendForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setEmail = useEmailStore((state) => state.setEmail);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SendPasswordValidation),
  });

  const handleRegister = async (values: { email: string }) => {
    setIsLoading(true);
    setEmail(values.email);
    const res = await sendCodePassword(values);
    if (res) {
      showToast("success", " کد با موفقیت به ایمیل شما ارسال شد. ");
      setIsLoading(false);
      reset();
      router.push("/forget-password/verify");
    } else {
      showToast("error", " ایمیل شما صحیح نمی باشد. ");
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div>
      <form className="mt-8 space-y-10" onSubmit={handleSubmit(handleRegister)}>
        <div className="flex flex-col gap-4">
          <div className="w-full flex gap-1 flex-col text-card-foreground">
            <Label htmlFor="email" className={`text-[13px] flex gap-0.5`}>
              <span> ایمیل شما </span>
              <p className="text-danger"> * </p>
              <span> : </span>
            </Label>
            <Input
              id="email"
              type="text"
              className="bg-transparent placeholder:text-card-foreground text-sm outline-none w-full py-3 border border-card-foreground text-card-foreground px-4 rounded-[16px] text-[16px]"
              placeholder={" لظفا ایمیل خود را وارد کنید. "}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger text-sm font-semibold">
                {errors.email.message}{" "}
              </p>
            )}
          </div>
        </div>

        <div>
          <CommonButton
            title={isLoading ? " در حال ارسال " : " ارسال کد "}
            icon={isLoading ? <Loader /> : <ChevronLeft size={16} />}
            classname="w-full text-primary-foreground"
          />
        </div>
      </form>
    </div>
  );
};

export default SendForm;
