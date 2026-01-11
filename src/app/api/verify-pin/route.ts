import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { pin } = await request.json();
        const correctPin = process.env.ACCESS_PIN;

        if (!correctPin) {
            // If no PIN is set, allow access
            return NextResponse.json({ success: true });
        }

        if (pin === correctPin) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Mã PIN không đúng' }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
    }
}
