import { Skeleton } from "@/components/ui/skeleton"

const RentalCardSkeleton = () => {
    return (
        <Skeleton className="rtl flex justify-between gap-4 items-center w-full md:basis-[calc(50%-1rem)] h-[180px] overflow-hidden bg-transparent rounded-2xl p-4">
            <div className="w-fit h-full md:block hidden">
                <Skeleton className="w-[240px] h-full bg-secondary-light3 rounded-xl" />
            </div>

            <div className="flex flex-col justify-between w-full gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 bg-secondary-light2 rounded-full" />
                    <Skeleton className="h-4 w-24 bg-secondary-light2 rounded-full" />
                </div>

                <Skeleton className="h-5 w-48 bg-secondary-light4 rounded-full" />
                <Skeleton className="h-4 md:w-72 w-full bg-secondary-light2 rounded-full" />
                <Skeleton className="h-4 md:w-72 w-full bg-secondary-light2 rounded-full" />

            </div>

            <div className="md:flex hidden flex-col justify-between items-center gap-4 h-full">
                <Skeleton className="h-4 w-32 bg-secondary-light2 rounded-full" />

                <Skeleton className="h-10 w-40 bg-secondary-light3 rounded-xl" />
            </div>

        </Skeleton>
    )
}

export default RentalCardSkeleton
