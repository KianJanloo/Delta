import { z } from "zod";

export const sharedValidation = z.object({
    email: z.string({ required_error: " ایمیل را باید وارد کنید " }).min(1, " ایمیل را باید وارد کنید ").email(" ایمیل صحیح نمی باشد "),
    mobile: z.string({ required_error: " شماره موبایل را باید وارد کنید " }).min(1, " شماره موبایل را باید وارد کنید ").max(15, " شماره موبایل باید کمتر از ۱۵ کاراکتر باشد ")
})