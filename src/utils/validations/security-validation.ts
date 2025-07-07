import { z } from "zod";

export const securityValidation = z.object({
    previousPassword: z.string({ required_error: "رمز عبور قبلی خود را وارد کنید" }).min(1, { message: "رمز عبور قبلی خود را وارد کنید" }),
    password: z.string({ required_error: "رمز عبور خود را وارد کنید" }).min(1, { message: "رمز عبور خود را وارد کنید" }),
    confirmPassword: z.string({ required_error: "تایید رمز عبور خود را وارد کنید" }).min(1, { message: "تایید رمز عبور خود را وارد کنید" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تایید رمز عبور مطابقت ندارند",
    path: ["confirmPassword"],
})