"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Send,
  Loader2,
  Clock,
  Sparkles,
  User,
  Bot,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SHARED_USER_ID = "shared-user-main-datastore";

interface StoryPart {
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

interface DailyStoryData {
  parts: StoryPart[];
  lastSubmission: string | null;
  dateCreated?: unknown;
  dateModified?: unknown;
}

export function DailyStoryBuild() {
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(true);

  const firestore = useFirestore();

  // Fetch story data from Firestore
  const storyDocRef = useMemoFirebase(
    () =>
      firestore
        ? doc(firestore, "users", SHARED_USER_ID, "playground", "daily-story")
        : null,
    [firestore]
  );

  const { data: storyData, isLoading } = useDoc<DailyStoryData>(storyDocRef);

  // Check if 24 hours have passed since last submission
  useEffect(() => {
    if (!storyData?.lastSubmission) {
      setCanSubmit(true);
      setTimeRemaining(null);
      return;
    }

    const checkTime = () => {
      const lastSubmission = new Date(storyData.lastSubmission!).getTime();
      const now = Date.now();
      const diff = 24 * 60 * 60 * 1000 - (now - lastSubmission);

      if (diff <= 0) {
        setCanSubmit(true);
        setTimeRemaining(null);
      } else {
        setCanSubmit(false);
        const hours = Math.floor(diff / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [storyData?.lastSubmission]);

  const handleSubmit = async () => {
    if (!userInput.trim() || !canSubmit || !firestore) return;

    setIsSubmitting(true);

    try {
      // Get AI response
      const previousStory = storyData?.parts
        ?.map((p) => p.content)
        .join("\n\n");

      const response = await fetch("/api/story-continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPart: userInput.trim(),
          previousStory,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Save to Firestore
      const now = new Date().toISOString();
      const newParts: StoryPart[] = [
        ...(storyData?.parts || []),
        { type: "user", content: userInput.trim(), timestamp: now },
        { type: "ai", content: data.aiPart, timestamp: now },
      ];

      await setDoc(
        doc(firestore, "users", SHARED_USER_ID, "playground", "daily-story"),
        {
          parts: newParts,
          lastSubmission: now,
          dateModified: serverTimestamp(),
          ...(storyData ? {} : { dateCreated: serverTimestamp() }),
        }
      );

      setUserInput("");
    } catch (error) {
      console.error("Error submitting story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearStory = async () => {
    if (!firestore) return;
    
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ câu chuyện? Hành động này không thể hoàn tác."
    );
    
    if (confirmed) {
      await setDoc(
        doc(firestore, "users", SHARED_USER_ID, "playground", "daily-story"),
        {
          parts: [],
          lastSubmission: null,
          dateModified: serverTimestamp(),
        }
      );
    }
  };

  const parts = storyData?.parts || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Story Display */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BookOpen className="h-5 w-5" />
                Câu chuyện của chúng ta
              </CardTitle>
              <CardDescription>
                {parts.length === 0
                  ? "Câu chuyện sẽ được xây dựng ở đây..."
                  : `${parts.length} phần đã được viết`}
              </CardDescription>
            </div>
            {parts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearStory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa truyện
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <ScrollArea className="h-[400px] pr-4">
            {parts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                <p>Chưa có nội dung nào.</p>
                <p className="text-sm">
                  Hãy viết phần đầu tiên của câu chuyện!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {parts.map((part, index) => (
                  <div key={index}>
                    <div
                      className={cn(
                        "flex gap-3 p-4 rounded-lg",
                        part.type === "user"
                          ? "bg-primary/10 border-l-4 border-primary"
                          : "bg-secondary/10 border-l-4 border-secondary"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          part.type === "user"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary/20 text-secondary-foreground"
                        )}
                      >
                        {part.type === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          {part.type === "user" ? "Bạn" : "AI"} •{" "}
                          {new Date(part.timestamp).toLocaleDateString("vi-VN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {part.content}
                        </p>
                      </div>
                    </div>
                    {index < parts.length - 1 && (
                      <Separator className="my-2 opacity-30" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Viết phần tiếp theo
          </CardTitle>
          {!canSubmit && timeRemaining && (
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">
                Có thể viết tiếp sau: {timeRemaining}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={
              canSubmit
                ? "Viết phần tiếp theo của câu chuyện..."
                : "Bạn đã viết hôm nay rồi. Hãy quay lại sau 24 giờ!"
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={!canSubmit || isSubmitting}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {userInput.length} ký tự
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!userInput.trim() || !canSubmit || isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi & Tiếp tục
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
