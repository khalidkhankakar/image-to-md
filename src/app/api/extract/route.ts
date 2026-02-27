import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert document OCR and formatting assistant.
Your task is to extract ALL text visible in the provided image and reproduce it as clean, well-structured Markdown.

Rules:
- Preserve the exact heading hierarchy from the image (use #, ##, ### etc.)
- Keep paragraphs, bullet points, numbered lists, and bold/italic formatting as they appear
- Maintain the original reading order (top to bottom, left to right)
- Do NOT add any commentary, explanation, or extra text — output ONLY the extracted Markdown
- If text is partially obscured, do your best to infer it and note uncertainty with [?]
- Use code blocks if the image contains code snippets
- Use tables if the image contains tabular data`;

function getModel(modelId: string) {
    switch (modelId) {
        case "gemini":
            return google("gemini-2.5-flash");
        case "groq":
            return groq("meta-llama/llama-4-scout-17b-16e-instruct");
        default:
            throw new Error(`Unsupported model: ${modelId}`);
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get("image") as File | null;
        const modelId = (formData.get("model") as string) ?? "gemini";

        if (!imageFile) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 },
            );
        }

        // Convert file to base64 data URL for the AI SDK
        const bytes = await imageFile.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = imageFile.type || "image/png";
        const dataUrl = `data:${mimeType};base64,${base64}`;

        const model = getModel(modelId);

        const { text } = await generateText({
            model,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            image: dataUrl,
                        },
                        {
                            type: "text",
                            text: "Extract all text from this image as structured Markdown.",
                        },
                    ],
                },
            ],
        });

        return NextResponse.json({ markdown: text });
    } catch (error) {
        console.error("Extraction error:", error);
        const message =
            error instanceof Error ? error.message : "Failed to extract text";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
