import { z } from "zod";

export const changePasswordValidation = z.object({
    currentPassword: z.string({ required_error: "رمز عبور فعلی خود را وارد کنید" }).min(1, { message: "رمز عبور فعلی خود را وارد کنید" }),
    newPassword: z.string({ required_error: "رمز عبور جدید خود را وارد کنید" }).min(1, { message: "رمز عبور جدید خود را وارد کنید" }),
});
