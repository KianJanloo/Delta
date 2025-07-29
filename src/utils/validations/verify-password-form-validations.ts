import { z } from "zod";

export const VerifyPasswordFormValidation = z.object({
  resetCode: z
    .string({ required_error: " کد را وارد کنید " })
    .min(1, " کد را وارد کنید "),
});
