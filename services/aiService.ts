import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface LetterDetails {
    title: string;
    letterType: string;
    description: string;
}

export const generateLetterDraft = async ({ title, letterType, description }: LetterDetails): Promise<string> => {
    const model = "gemini-2.5-flash";

    const formattedLetterType = letterType.split('_').join(' ');

    const prompt = `
        You are an expert legal assistant specializing in drafting professional letters.
        Your task is to generate a formal letter based on the user's request.

        **Letter Details:**
        - **Subject/Title:** ${title}
        - **Type of Letter:** ${formattedLetterType}
        - **Key Information & Context:** ${description}

        **Instructions:**
        1.  Draft a complete, professional letter body based on the provided details.
        2.  Adopt a formal and clear tone appropriate for a legal or business context.
        3.  Structure the letter logically with an introduction, main body detailing the issue, and a conclusion with a clear call to action or next steps.
        4.  Use placeholders like "[Your Name]", "[Your Address]", "[Recipient's Name]", "[Date]", etc., where specific personal information is required.
        5.  DO NOT include a subject line (e.g., "Subject: ..."). Start directly with the salutation (e.g., "Dear [Recipient's Name],").
        6.  The entire response should be ONLY the body of the letter. Do not include any extra explanations, greetings, or sign-offs outside of the letter's content itself.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate letter draft from AI. Please check the console for more details.");
    }
};
