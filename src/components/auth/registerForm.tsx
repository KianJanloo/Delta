/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { ChevronLeft, Loader } from "lucide-react";
import CommonButton from "../common/buttons/common/CommonButton";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaRegisterValidation } from "@/utils/validations/register-validation";
import { showToast } from "@/core/toast/toast";
import { useState } from "react";
import axiosApi from "@/core/interceptore/axiosApi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useUserStore, useEmailStore } from "@/utils/zustand/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";

const RegisterForm = () => {
  const t = useTranslations('auth.registerForm');
  const dir = useDirection()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const setTempUserId = useUserStore(state => state.setTempUserId)
  const setEmail = useEmailStore(state => state.setEmail)

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaRegisterValidation)
  })

  const handleRegister = async (values: any) => {
    setIsLoading(true)
    try {
      setEmail(values.email)
      const res = await axiosApi.post('/auth/register', values) as any
      if (res.tempUserId) {
        setTempUserId(res.tempUserId)
      }
      if (res) {
        showToast("success", t("successTitle"), t("close"), t("successMessage"))
        setIsLoading(false)
        reset()
        router.push("/verifyCode")
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        showToast("error", t("errorTitle"), t("close"), error.response.data.message, 5000)
      }
      else {
        showToast("error", t("errorTitle"), t("close"), t("errorMessage"), 5000)
      }
      setIsLoading(false)
    }
  }

  return (
    <div dir={dir}>
      <form className="mt-8 space-y-10" onSubmit={handleSubmit(handleRegister)}>
        <div className="flex flex-col gap-4">
          <div className="w-full flex gap-1 flex-col text-card-foreground">
            <Label htmlFor="email" className={`text-[13px] flex gap-0.5`}>
              <span>{t("email")}</span>
              <p className='text-danger'> * </p>
              <span> : </span>
            </Label>
            <Input
              id="email"
              type="text"
              className="bg-transparent placeholder:text-card-foreground text-sm outline-none w-full py-3 border border-card-foreground text-card-foreground px-4 rounded-[16px] text-[16px]"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && <p className='text-danger text-sm font-semibold'>{errors.email.message} </p>}
          </div>
        </div>

        <div>
          <CommonButton
            title={isLoading ? t("loading") : t("submit")}
            icon={isLoading ? <Loader /> : <ChevronLeft size={16} />}
            classname="w-full text-primary-foreground"
          />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;