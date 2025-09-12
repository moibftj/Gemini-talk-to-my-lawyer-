import { GoogleGenAI } from "https://esm.sh/@google/genai@1.19.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

// Define interfaces for type safety
interface GenerateDraftPayload {
    title: string;
    templateBody: string;
    templateFields: Record<string, string>;
    additionalContext: string;
    tone?: 'Formal' | 'Aggressive' | 'Conciliatory' | 'Neutral';
    length?: 'Short' | 'Medium' | 'Long';
}

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Get the payload from the request body
    const payload: GenerateDraftPayload = await req.json();
    
    // Validate required fields
    if (!payload.title || !payload.templateBody) {
      throw new Error("Missing required fields: title and templateBody");
    }
    
    // SECURELY get the Gemini API key from Supabase secrets
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable not set.");
    }

    // Initialize the Gemini client and build the prompt
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const model = "gemini-1.5-flash";

    const systemInstruction = `You are an expert legal assistant. Your primary task is to complete a given letter template using user-provided details.

Follow these instructions strictly:
1.  Carefully replace the placeholders (e.g., [Your Name], [Amount Owed]) in the template with the corresponding user-provided details.
2.  If a detail for a placeholder is not provided, you MUST replace it with a clear indicator like "[Information Not Provided]" in the final letter. Do not leave the original placeholder (e.g., [Amount Owed]) in the text.
3.  Incorporate the "Additional Context" where it seems most relevant within the letter body to add necessary detail or clarify points.
4.  Ensure the final letter flows naturally and is grammatically correct after filling in the details.
5.  Adhere strictly to any provided Tone & Style instructions when filling in the template.
6.  Your entire response should be ONLY the completed body of the letter. Do not include a subject line, greetings, sign-offs, or explanations outside of the letter's content itself.`;

    let styleInstructions = '';
    if (payload.tone || payload.length) {
        styleInstructions += '\n**Tone & Style Instructions:**\n';
        if (payload.tone) styleInstructions += `- **Tone:** The tone of the letter should be professional and ${payload.tone.toLowerCase()}.\n`;
        if (payload.length) {
            let lengthDesc = '';
            switch (payload.length) {
                case 'Short': lengthDesc = 'concise and to the point.'; break;
                case 'Medium': lengthDesc = 'standard, with sufficient detail.'; break;
                case 'Long': lengthDesc = 'comprehensive and highly detailed.'; break;
            }
            styleInstructions += `- **Length:** The filled-in sections should be relatively ${payload.length.toLowerCase()}, resulting in a letter that is ${lengthDesc}\n`;
        }
    }

    const userPrompt = `
        Please complete the letter.
        The letter's subject is "${payload.title}".
        **Template to complete:**
        ---
        ${payload.templateBody}
        ---
        **User-provided details to fill in the placeholders:**
        ${Object.entries(payload.templateFields).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
        **Additional Context from the user (incorporate this where relevant):**
        ${payload.additionalContext || 'No additional context provided.'}
        ${styleInstructions}
    `;

    // Call the Gemini API
    const genModel = ai.getGenerativeModel({ model });
    const response = await genModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    });
    
    if (!response.response) {
      throw new Error("No response from AI model");
    }
    
    const draft = response.response.text();
    
    if (!draft) {
      throw new Error("Empty response from AI model");
    }

    // Return the successful response
    return new Response(JSON.stringify({ draft }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-draft function:', error);
    // Handle any errors
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred while generating the draft" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

      model,
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });
    const draft = response.text;

    // 6. Return the successful response
    return new Response(JSON.stringify({ draft }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // 7. Handle any errors
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});