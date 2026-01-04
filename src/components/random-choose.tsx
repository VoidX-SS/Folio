"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dices, Trash2, Sparkles, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "random-choose-data";

interface ItemWithWeight {
    name: string;
    weight: number;
}

interface StoredData {
    inputText: string;
    items: ItemWithWeight[];
    showAdvanced: boolean;
}

export function RandomChoose() {
    const [inputText, setInputText] = useState("");
    const [items, setItems] = useState<ItemWithWeight[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: StoredData = JSON.parse(stored);
                setInputText(data.inputText || "");
                setItems(data.items || []);
                setShowAdvanced(data.showAdvanced || false);
            }
        } catch (e) {
            console.error("Failed to load saved data:", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when data changes
    useEffect(() => {
        if (!isLoaded) return; // Don't save during initial load
        try {
            const data: StoredData = { inputText, items, showAdvanced };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save data:", e);
        }
    }, [inputText, items, showAdvanced, isLoaded]);

    // Parse input text into items with default equal weights
    const parseItems = useCallback((text: string): ItemWithWeight[] => {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        return lines.map((line) => ({
            name: line.trim(),
            weight: 1,
        }));
    }, []);

    // Handle input change
    const handleInputChange = (text: string) => {
        setInputText(text);
        if (!showAdvanced) {
            setItems(parseItems(text));
        }
    };

    // Handle switching to advanced mode
    const handleAdvancedToggle = (enabled: boolean) => {
        setShowAdvanced(enabled);
        if (enabled && items.length === 0) {
            setItems(parseItems(inputText));
        }
    };

    // Update weight for a specific item
    const updateWeight = (index: number, weight: number) => {
        setItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, weight: Math.max(0, weight) } : item))
        );
    };

    // Weighted random selection
    const pickRandom = useCallback(() => {
        const currentItems = showAdvanced ? items : parseItems(inputText);

        if (currentItems.length === 0) {
            setResult(null);
            return;
        }

        setIsSpinning(true);

        // Calculate total weight
        const totalWeight = currentItems.reduce((sum, item) => sum + item.weight, 0);

        if (totalWeight === 0) {
            setResult(null);
            setIsSpinning(false);
            return;
        }

        // Pick random based on weights
        let random = Math.random() * totalWeight;
        let selected = currentItems[0].name;

        for (const item of currentItems) {
            random -= item.weight;
            if (random <= 0) {
                selected = item.name;
                break;
            }
        }

        // Animate through a few random items before settling
        let iterations = 0;
        const maxIterations = 10;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * currentItems.length);
            setResult(currentItems[randomIndex].name);
            iterations++;

            if (iterations >= maxIterations) {
                clearInterval(interval);
                setResult(selected);
                setIsSpinning(false);
            }
        }, 80);
    }, [inputText, items, showAdvanced, parseItems]);

    // Clear everything
    const handleClear = () => {
        setInputText("");
        setItems([]);
        setResult(null);
    };

    const currentItems = showAdvanced ? items : parseItems(inputText);

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Dices className="h-5 w-5" />
                        Nhập danh sách
                    </CardTitle>
                    <CardDescription>
                        Nhập mỗi lựa chọn trên một dòng riêng
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Lựa chọn 1&#10;Lựa chọn 2&#10;Lựa chọn 3&#10;..."
                        value={inputText}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="min-h-[150px] font-mono"
                        disabled={showAdvanced}
                    />

                    {/* Advanced Mode Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="advanced-mode" className="cursor-pointer">
                                Chế độ nâng cao (Phân bố & Tỷ lệ)
                            </Label>
                        </div>
                        <Switch
                            id="advanced-mode"
                            checked={showAdvanced}
                            onCheckedChange={handleAdvancedToggle}
                        />
                    </div>

                    {/* Advanced: Weight Editor */}
                    {showAdvanced && (
                        <div className="space-y-3 p-4 rounded-lg border bg-background">
                            <p className="text-sm text-muted-foreground">
                                Điều chỉnh tỷ lệ cho mỗi lựa chọn (mặc định là 1, bằng nhau)
                            </p>
                            {items.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                    Chưa có lựa chọn nào. Nhập danh sách trước khi bật chế độ nâng cao.
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {items.map((item, index) => {
                                        const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
                                        const percentage = totalWeight > 0 ? ((item.weight / totalWeight) * 100).toFixed(1) : "0.0";

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
                                            >
                                                <span className="flex-1 truncate text-sm font-medium">
                                                    {item.name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        value={item.weight}
                                                        onChange={(e) => updateWeight(index, parseFloat(e.target.value) || 0)}
                                                        className="w-20 h-8 text-sm"
                                                    />
                                                    <span className="text-xs text-muted-foreground w-14 text-right">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    onClick={pickRandom}
                    disabled={currentItems.length === 0 || isSpinning}
                    className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                >
                    <Sparkles className={cn("h-5 w-5 mr-2", isSpinning && "animate-spin")} />
                    {isSpinning ? "Đang chọn..." : "Chọn Ngẫu Nhiên"}
                </Button>
                <Button
                    variant="outline"
                    onClick={handleClear}
                    className="h-12"
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>

            {/* Result Display */}
            <Card
                className={cn(
                    "overflow-hidden transition-all duration-500",
                    result ? "opacity-100 translate-y-0" : "opacity-50 translate-y-2"
                )}
            >
                <div className="relative">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

                    <CardHeader className="relative">
                        <CardTitle className="text-center text-lg font-medium text-muted-foreground">
                            Kết quả
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative pb-8">
                        <div
                            className={cn(
                                "min-h-[100px] flex items-center justify-center p-6 rounded-xl",
                                "bg-gradient-to-br from-primary/5 to-secondary/5",
                                "border-2 border-dashed border-primary/20",
                                isSpinning && "animate-pulse"
                            )}
                        >
                            {result ? (
                                <p
                                    className={cn(
                                        "text-3xl md:text-4xl font-bold text-center",
                                        "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
                                        "transition-all duration-300",
                                        isSpinning ? "scale-95 opacity-70" : "scale-100 opacity-100"
                                    )}
                                >
                                    {result}
                                </p>
                            ) : (
                                <p className="text-muted-foreground text-center">
                                    {currentItems.length === 0
                                        ? "Nhập danh sách để bắt đầu..."
                                        : "Nhấn nút để chọn ngẫu nhiên!"}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </div>
            </Card>

            {/* Stats */}
            {currentItems.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                    Tổng số lựa chọn: <span className="font-semibold">{currentItems.length}</span>
                </p>
            )}
        </div>
    );
}
