import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET() {
    return NextResponse.json({
        message: 'Hello, how can I help you today?'
    });
}

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const result = streamText({
            model: openrouter('deepseek/deepseek-chat:free'),
            messages: [{
                role: 'system',
                content: 'Hello, how can I help you today?'
            }, {
                role: 'user',
                content: prompt
            }]
        });

        return result.toDataStreamResponse();
    } catch (error) {
        return NextResponse.json({
            error
        });
    }
}