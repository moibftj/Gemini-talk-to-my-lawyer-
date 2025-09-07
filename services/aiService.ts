import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export type LetterTone = 'Formal' | 'Aggressive' | 'Conciliatory' | 'Neutral';
export type LetterLength = 'Short' | 'Medium' | 'Long';

interface LetterDetails {
    title: string;
    templateBody: string;
    templateFields: Record<string, string>;
    additionalContext: string;
    tone?: LetterTone;
    length?: LetterLength;
}

export const generateLetterDraft = async ({ title, templateBody, templateFields, additionalContext, tone, length }: LetterDetails): Promise<string> => {
    const model = "gemini-2.5-flash";

    let styleInstructions = '';
    if (tone || length) {
        styleInstructions += '\n**Tone & Style Instructions:**\n';
        if (tone) {
            styleInstructions += `- **Tone:** The tone of the letter should be professional and ${tone.toLowerCase()}.\n`;
        }
        if (length) {
            let lengthDesc = '';
            switch (length) {
                case 'Short': lengthDesc = 'concise and to the point.'; break;
                case 'Medium': lengthDesc = 'standard, with sufficient detail.'; break;
                case 'Long': lengthDesc = 'comprehensive and highly detailed.'; break;
            }
            styleInstructions += `- **Length:** The filled-in sections should be relatively ${length.toLowerCase()}, resulting in a letter that is ${lengthDesc}\n`;
        }
    }

    const prompt = `
        You are an expert legal assistant. Your task is to complete the following letter template using the user-provided details.
        The letter's subject is "${title}".

        **Template to complete:**
        ---
        ${templateBody}
        ---

        **User-provided details to fill in the placeholders:**
        ${Object.entries(templateFields).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
        
        **Additional Context from the user (incorporate this where relevant):**
        ${additionalContext || 'No additional context provided.'}
        ${styleInstructions}
        **Instructions:**
        1.  Carefully replace the placeholders (e.g., [Your Name], [Amount Owed]) in the template with the corresponding user-provided details.
        2.  If a detail for a placeholder is not provided, you MUST replace it with a clear indicator like "[Information Not Provided]" in the final letter. Do not leave the original placeholder (e.g., [Amount Owed]) in the text.
        3.  Incorporate the "Additional Context" where it seems most relevant within the letter body to add necessary detail or clarify points.
        4.  Ensure the final letter flows naturally and is grammatically correct after filling in the details.
        5.  Adhere strictly to the Tone & Style instructions when filling in the template.
        6.  The entire response should be ONLY the completed body of the letter. Do not include a subject line, greetings, sign-offs, or explanations outside of the letter's content itself.
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
