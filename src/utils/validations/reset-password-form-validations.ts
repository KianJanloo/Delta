import { z } from "zod";

export const resetPasswordFormValidation = z.object({
  newPassword: z
    .string({ required_error: " رمز عبور خود را وارد کنید " })
    .min(1, " رمز عبور خود را وارد کنید "),
});
