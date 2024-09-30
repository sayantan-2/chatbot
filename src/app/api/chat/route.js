// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
    const { message } = await request.json();

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama3-8b-8192",
        });

        const response = chatCompletion.choices[0]?.message?.content || "";
        console.log('Response:', response);
        return NextResponse.json({ response });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'An error occurred while processing your request.' }, { status: 500 });
    }
}