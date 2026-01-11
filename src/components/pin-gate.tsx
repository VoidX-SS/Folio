"use client";

import { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "folio-pin-verified";

interface PinGateProps {
    children: React.ReactNode;
}

export function PinGate({ children }: PinGateProps) {
    const [pin, setPin] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    // Check if already verified in session
    useEffect(() => {
        const verified = sessionStorage.getItem(SESSION_KEY);
        if (verified === "true") {
            setIsVerified(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/verify-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin }),
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem(SESSION_KEY, "true");
                setIsVerified(true);
            } else {
                setError(data.message || "Mã PIN không đúng");
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setPin("");
            }
        } catch {
            setError("Không thể kết nối đến server");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Show children if verified
    if (isVerified) {
        return <>{children}</>;
    }

    // Show PIN entry form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl" />
            </div>

            <Card
                className={cn(
                    "w-full max-w-md relative overflow-hidden transition-transform",
                    shake && "animate-shake"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                <CardHeader className="relative text-center pb-2">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Digital Folio</CardTitle>
                    <CardDescription>
                        Nhập mã PIN để truy cập
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Nhập mã PIN..."
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="text-center text-2xl tracking-[0.5em] h-14 font-mono"
                                autoFocus
                                disabled={isSubmitting}
                            />
                            {error && (
                                <p className="text-destructive text-sm text-center animate-in fade-in">
                                    {error}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-semibold"
                            disabled={!pin || isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Unlock className="h-5 w-5 mr-2" />
                                    Mở khóa
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
}
