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
import { Edit, X, Upload, ImageIcon, Loader2, Trash2 } from "lucide-react"
import { uploadHousePhotos } from "@/utils/service/api/houses/uploadPhotos"
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
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewPhotos(prev => [...prev, ...filesArray]);
            
            // Create preview URLs
            const urls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
        }
    };

    const removeExistingPhoto = (indexToRemove: number) => {
        setPhotos(photos.filter((_, index) => index !== indexToRemove));
    };

    const removeNewPhoto = (indexToRemove: number) => {
        setNewPhotos(newPhotos.filter((_, index) => index !== indexToRemove));
        URL.revokeObjectURL(previewUrls[indexToRemove]);
        setPreviewUrls(previewUrls.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadPhotos = async () => {
        if (newPhotos.length === 0 || !house.id) return;
        
        try {
            setIsUploadingPhotos(true);
            const response = await uploadHousePhotos(String(house.id), newPhotos);
            
            if (response && Array.isArray(response.photos)) {
                setPhotos(prev => [...prev, ...response.photos]);
                setNewPhotos([]);
                previewUrls.forEach(url => URL.revokeObjectURL(url));
                setPreviewUrls([]);
                showToast("success", "تصاویر با موفقیت آپلود شدند");
            }
        } catch (error) {
            showToast("error", "خطا در آپلود تصاویر");
        } finally {
            setIsUploadingPhotos(false);
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
                    {/* Photos Upload Section */}
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-subText text-sm">تصاویر ملک</Label>
                            {newPhotos.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleUploadPhotos}
                                    disabled={isUploadingPhotos}
                                    className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
                                >
                                    {isUploadingPhotos ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            در حال آپلود...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={14} />
                                            آپلود تصاویر جدید
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        
                        {/* Existing Photos */}
                        {photos.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-subText">تصاویر فعلی:</span>
                                <div className="flex flex-wrap gap-2">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border-2 border-border">
                                            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingPhoto(index)}
                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* New Photos Preview */}
                        {previewUrls.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-xs text-subText">تصاویر جدید (آپلود نشده):</span>
                                <div className="flex flex-wrap gap-2">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border-2 border-primary">
                                            <img src={url} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewPhoto(index)}
                                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Upload Button */}
                        <label className="border-2 border-dashed border-subText rounded-xl p-4 hover:border-primary cursor-pointer transition-colors flex flex-col items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploadingPhotos}
                            />
                            <ImageIcon size={32} className="text-subText" />
                            <span className="text-sm text-subText">انتخاب تصاویر جدید</span>
                            <span className="text-xs text-muted">می‌توانید چند تصویر را انتخاب کنید</span>
                        </label>
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
