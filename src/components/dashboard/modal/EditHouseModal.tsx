/* eslint-disable */

"use client"
import { editHouse } from "@/utils/service/api/houses/editHouse"
import { IHouse } from "@/types/houses-type/house-type"
import { showToast } from "@/core/toast/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import CommonButton from "@/components/common/buttons/common/CommonButton"
import { z } from "zod";

const schema = z.object({
    title: z
        .string({
            required_error: "عنوان الزامی است.",
            invalid_type_error: "عنوان باید رشته باشد.",
        })
        .min(1, "عنوان الزامی است."),

    price: z
        .number({
            required_error: "قیمت الزامی است.",
            invalid_type_error: "قیمت باید عدد باشد.",
        })
        .min(1, "قیمت باید حداقل 1 باشد."),

    capacity: z
        .number({
            required_error: "ظرفیت الزامی است.",
            invalid_type_error: "ظرفیت باید عدد باشد.",
        })
        .min(1, "ظرفیت باید حداقل 1 باشد."),

    caption: z
        .string({
            required_error: "توضیحات الزامی است.",
            invalid_type_error: "توضیحات باید رشته باشد.",
        })
        .min(1, "توضیحات الزامی است."),

    tags: z.array(z.string()).optional(),

    address: z
        .string({
            required_error: "آدرس الزامی است.",
            invalid_type_error: "آدرس باید رشته باشد.",
        })
        .min(1, "آدرس الزامی است."),

    bathrooms: z
        .number({
            required_error: "تعداد حمام الزامی است.",
            invalid_type_error: "تعداد حمام باید عدد باشد.",
        })
        .min(0, "تعداد حمام نمی‌تواند منفی باشد."),

    parking: z
        .number({
            required_error: "تعداد پارکینگ الزامی است.",
            invalid_type_error: "تعداد پارکینگ باید عدد باشد.",
        })
        .min(0, "تعداد پارکینگ نمی‌تواند منفی باشد."),

    rooms: z
        .number({
            required_error: "تعداد اتاق الزامی است.",
            invalid_type_error: "تعداد اتاق باید عدد باشد.",
        })
        .min(0, "تعداد اتاق نمی‌تواند منفی باشد."),

    transaction_type: z.enum(
        ["", "rental", "mortgage", "reservation", "direct_purchase"],
        {
            required_error: "نوع معامله الزامی است.",
            invalid_type_error: "نوع معامله معتبر نیست.",
        }
    ),
});


type FormValues = z.infer<typeof schema>

const EditHouseModal = ({
    house,
    reset,
}: {
    house: Partial<IHouse>,
    reset: () => void,
}) => {
    const [open, setOpen] = useState(false)
    const [photos, setPhotos] = useState<string[]>(house.photos || []);
    const [input, setInput] = useState('');

    const removePhotos = (indexToRemove: any) => {
        setPhotos(photos.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: any) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            const newTag = input.trim()
            if (!photos.includes(newTag)) {
                setPhotos([...photos, newTag]);
            }
            setInput('');
        } else if (e.key === 'Backspace' && !input && photos.length) {
            setPhotos(photos.slice(0, -1));
        }
    };

    const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: house.title,
            price: Number(house.price),
            capacity: house.capacity,
            caption: house.caption || "",
            address: house.address,
            bathrooms: house.bathrooms,
            parking: house.parking,
            rooms: house.rooms,
            transaction_type: house.transaction_type
        },
    })

    const onError = (err: any) => {
        console.log("Validation Errors:", err);
    };

    const onSubmit = async (data: FormValues) => {
        console.log("Submit")
        const dataSubmit = {
            title: data.title,
            price: JSON.stringify(data.price),
            capacity: data.capacity,
            caption: data.caption || "",
            photos: photos,
            address: data.address,
            bathrooms: data.bathrooms,
            parking: data.parking,
            rooms: data.rooms,
            transaction_type: data.transaction_type
        }

        try {
            if (house.id) {
                await editHouse(house.id, dataSubmit)
                showToast("success", "ملک با موفقیت ویرایش شد.")
                setOpen(false)
                resetForm()
                reset()
            }
        } catch {
            showToast("error", "خطا در ویرایش ملک.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='px-4 py-1 flex gap-2 rounded-xl justify-end flex-row-reverse cursor-pointer hover:bg-subBg2'> {" ویرایش "} <Edit size={16} /> </div>
            </DialogTrigger>
            <DialogContent onMouseDown={(e) => e.stopPropagation()} className="max-w-[600px] overflow-y-auto max-h-dvh">
                <DialogHeader>
                    <DialogTitle className="text-center">ویرایش مشخصات ملک</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4 mt-2">
                    <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="tags" className="text-subText text-sm">
                            تصاویر ملک
                        </Label>
                        <div className="flex flex-wrap gap-2 px-4 py-2 border border-subText rounded-xl">
                            {photos.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-primary text-primary-foreground gap-1 px-2 py-1 rounded-lg text-sm max-w-[200px] truncate line-clamp-1"
                                >
                                    <button
                                        type="button"
                                        className="ml-1 text-primary-foreground"
                                        onClick={() => removePhotos(index)}
                                    >
                                        <X size={14} />
                                    </button>
                                    {tag}
                                </div>
                            ))}
                            <input
                                id="photos"
                                name="photos"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-grow bg-transparent text-subText text-sm focus:outline-none"
                                placeholder=" تصویر ملک را وارد و Enter بزنید "
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title" className="text-subText">عنوان ملک</Label>
                        <Input
                            id="title"
                            {...register("title")}
                            placeholder="عنوان ملک"
                            className="w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText"
                        />
                        {errors.title && <span className="text-xs text-danger">{errors.title.message}</span>}
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label htmlFor="price" className="text-subText">قیمت</Label>
                            <Input
                                id="price"
                                type="number"
                                {...register("price", { valueAsNumber: true })}
                                placeholder="قیمت"
                                className="w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText"
                            />
                            {errors.price && <span className="text-xs text-danger">{errors.price.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label htmlFor="capacity" className="text-subText">ظرفیت</Label>
                            <Input
                                id="capacity"
                                type="number"
                                {...register("capacity", { valueAsNumber: true })}
                                placeholder="ظرفیت"
                                className="w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText"
                            />
                            {errors.capacity && <span className="text-xs text-danger">{errors.capacity.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="caption" className="text-subText">توضیحات</Label>
                        <Textarea
                            id="caption"
                            {...register("caption")}
                            placeholder="توضیحات"
                            className="w-full h-[120px] rounded-xl border border-subText text-subText"
                        />
                        {errors.caption && <span className="text-xs text-danger">{errors.caption.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address" className="text-subText">آدرس</Label>
                        <Input
                            id="address"
                            {...register("address")}
                            placeholder="آدرس"
                            className="w-full px-4 py-2 text-sm bg-transparent border rounded-xl text-subText border-subText"
                        />
                        {errors.address && <span className="text-xs text-danger">{errors.address.message}</span>}
                    </div>

                    <div className="w-full flex gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label htmlFor="bathrooms" className="text-subText">تعداد حمام</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                {...register("bathrooms", { valueAsNumber: true })}
                                placeholder="تعداد حمام"
                                className="w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText"
                            />
                            {errors.bathrooms && <span className="text-xs text-danger">{errors.bathrooms.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <Label htmlFor="parking" className="text-subText">تعداد پارکینگ</Label>
                            <Input
                                id="parking"
                                type="number"
                                {...register("parking", { valueAsNumber: true })}
                                placeholder="تعداد پارکینگ"
                                className="w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText"
                            />
                            {errors.parking && <span className="text-xs text-danger">{errors.parking.message}</span>}
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label htmlFor="rooms" className="text-subText">تعداد اتاق</Label>
                            <Input
                                id="rooms"
                                type="number"
                                {...register("rooms", { valueAsNumber: true })}
                                placeholder="تعداد اتاق"
                                className="w-full text-sm px-4 py-2 bg-transparent border rounded-xl text-subText border-subText"
                            />
                            {errors.rooms && <span className="text-xs text-danger">{errors.rooms.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <Label htmlFor="transaction_type" className="text-subText">نوع معامله</Label>
                            <select
                                id="transaction_type"
                                {...register("transaction_type")}
                                className="w-full text-sm px-4 py-2 bg-secondary border rounded-xl text-subText border-subText"
                            >
                                <option value="">انتخاب کنید</option>
                                <option value="rental">اجاره</option>
                                <option value="mortgage">رهن</option>
                                <option value="reservation">رزرو</option>
                                <option value="direct_purchase">خرید مستقیم</option>
                            </select>
                            {errors.transaction_type && <span className="text-xs text-danger">{errors.transaction_type.message}</span>}
                        </div>
                    </div>
                    <CommonButton title={" ذخیره "} type="submit" classname="mt-2" />
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default EditHouseModal
