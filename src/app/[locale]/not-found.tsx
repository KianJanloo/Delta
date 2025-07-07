
import ButtonHome from "@/components/not-found/ButtonHome";
import ButtonPervious from "@/components/not-found/ButtonPervious";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-primary">۴۰۴ - صفحه پیدا نشد</h1>
      <p className="text-lg">متأسفیم، صفحه‌ای که دنبال آن هستید وجود ندارد.</p>
      <div className="flex gap-4 mt-4">
        <ButtonPervious />
        <ButtonHome />
      </div>
    </div>
  );
}
