import { ai } from '@/ai/genkit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { userPart, previousStory } = await request.json();

        if (!userPart || userPart.trim().length === 0) {
            return NextResponse.json(
                { success: false, message: 'Phần truyện không được để trống' },
                { status: 400 }
            );
        }

        const prompt = `Bạn là một người đồng sáng tác truyện. Người dùng đang viết một câu chuyện và bạn cần viết tiếp phần tiếp theo.

${previousStory ? `Câu chuyện đến nay:\n${previousStory}\n\n` : ''}Phần mới của người dùng:
${userPart}

Hãy viết tiếp câu chuyện (khoảng 100-200 từ). Giữ phong cách và giọng văn nhất quán với những gì đã viết. Viết trực tiếp phần tiếp theo, không cần giải thích hay bình luận. Viết bằng tiếng Việt.`;

        const { text } = await ai.generate(prompt);

        return NextResponse.json({
            success: true,
            aiPart: text.trim(),
        });
    } catch (error) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { success: false, message: 'Lỗi khi tạo câu chuyện' },
            { status: 500 }
        );
    }
}
