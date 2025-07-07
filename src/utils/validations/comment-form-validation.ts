import { z } from 'zod';

export const schemaCommentFormValidation = z.object({
    name: z.string({ required_error: 'نام و نام خانوادگی الزامی است' })
        .min(1, 'نام و نام خانوادگی الزامی است'),
    title: z.string({ required_error: 'عنوان الزامی است' })
        .min(1, 'عناون الزامی است'),
    caption: z.string({ required_error: ' پیام الزامی است ' })
        .min(10, 'پیام شما باید حداقل ۱۰ کاراکتر باشد')
});
