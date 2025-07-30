"use client";

import { showToast } from "@/core/toast/toast";
import { resetPassword } from "@/utils/service/api/forget-password/resetPassword";
import { resetPasswordFormValidation } from "@/utils/validations/reset-password-form-validations";
import { useCodeStore, useEmailStore } from "@/utils/zustand/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import CommonButton from "../common/buttons/common/CommonButton";
import { ChevronLeft, Loader } from "lucide-react";

const ResetForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { email } = useEmailStore();
  const { code } = useCodeStore();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordFormValidation),
  });

  const handleForgetPassword = async (values: { newPassword: string }) => {
    setIsLoading(true);
    const data = {
      email: email || "",
      resetCode: code || "",
      newPassword: values.newPassword,
    };

    const res = await resetPassword(data);

    if (res) {
      showToast("success", " پسورد شما با موفقیت تغییر یافت ");
      setIsLoading(false);
      reset();
      router.push("/login");
    } else {
      showToast("error", " تغییر رمز عبور با خطا برخورد کرد. ");
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div>
      <form
        className="mt-8 space-y-10"
        onSubmit={handleSubmit(handleForgetPassword)}
      >
        <div className="flex md:flex-row flex-col gap-4">
          <div className="w-full flex gap-1 flex-col text-card-foreground">
            <Label htmlFor="password" className={`text-[13px] flex gap-0.5`}>
              <span> رمز عبور جدید </span>
              <p className="text-danger"> * </p>
              <span> : </span>
            </Label>
            <Input
              id="newPassword"
              type="text"
              className="bg-transparent placeholder:text-card-foreground text-sm outline-none w-full py-3 border border-card-foreground text-card-foreground px-4 rounded-[16px] text-[16px]"
              placeholder={" رمز عبور جدید خود را وارد کنید "}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-danger text-sm font-semibold">
                {errors.newPassword.message}{" "}
              </p>
            )}
          </div>
        </div>

        <div>
          <CommonButton
            type="submit"
            title={isLoading ? " در حال تایید " : " تایید "}
            icon={isLoading ? <Loader /> : <ChevronLeft size={16} />}
            classname="w-full text-primary-foreground"
          />
        </div>
      </form>
    </div>
  );
};

export default ResetForm;
