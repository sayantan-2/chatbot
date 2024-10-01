import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
    const { message, history } = await request.json();

    try {
        const stream = await groq.chat.completions.create({
            messages: [
                ...history, // Include chat history
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.1-8b-instant",
            stream: true, // Enable streaming

            // Add max_tokens to increase token size
            max_tokens: 8000, // Adjust this value based on your requirements

            temperature: 0.5,
            top_p: 1,
            stop: null,
        });

        // Create a readable stream to send data chunk by chunk
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content || "";
                    controller.enqueue(encoder.encode(text));
                }
                controller.close();
            },
        });

        // Return the stream as the response
        return new Response(readableStream, {
            headers: { 'Content-Type': 'text/event-stream' },
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
