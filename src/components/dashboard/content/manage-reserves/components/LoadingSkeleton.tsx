import { BlurFade } from "@/components/magicui/blur-fade";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <BlurFade className="flex flex-col justify-between gap-8 bg-subBg p-4 sm:p-6 lg:p-8 rounded-xl w-full min-h-screen">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </BlurFade>
  );
} 