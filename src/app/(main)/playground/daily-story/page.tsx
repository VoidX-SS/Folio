import { DailyStoryBuild } from "@/components/daily-story-build";

export default function DailyStoryPage() {
    return (
        <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
            <header>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                    Xây Dựng Truyện Hàng Ngày
                </h1>
                <p className="text-muted-foreground mt-1">
                    Mỗi ngày bạn viết một phần, AI viết tiếp phần tiếp theo. Cùng xây dựng câu chuyện!
                </p>
            </header>

            <DailyStoryBuild />
        </div>
    );
}
