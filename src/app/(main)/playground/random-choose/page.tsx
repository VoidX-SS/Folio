import { RandomChoose } from "@/components/random-choose";

export default function RandomChoosePage() {
    return (
        <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
            <header>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                    Chọn Ngẫu Nhiên
                </h1>
                <p className="text-muted-foreground mt-1">
                    Nhập danh sách và để công cụ chọn giúp bạn một kết quả ngẫu nhiên.
                </p>
            </header>

            <RandomChoose />
        </div>
    );
}
