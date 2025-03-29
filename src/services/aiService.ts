
import { toast } from "sonner";

const COHERE_API_KEY = 'LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97';
const COHERE_MODEL = 'command-a-03-2025';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export async function chatWithCohere(userMessage: string, systemPrompt?: string): Promise<string> {
  try {
    console.log('Sending message to Cohere:', { userMessage, systemPrompt });
    
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        message: userMessage,
        preamble: systemPrompt || "Keep your responses brief and concise, under 3 sentences when possible."
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received response from Cohere:', data);
    
    return data.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    toast.error('Failed to connect to AI service');
    return "Sorry, I encountered an issue. Please try again later.";
  }
}

export async function generateCrimeScenario(difficulty: DifficultyLevel): Promise<{
  title: string;
  scenario: string;
  characters: Array<{ name: string; description: string }>;
  conversations: Array<{ speaker: string; text: string }>;
  culprit: string;
}> {
  const systemPrompt = `
You are a master mystery writer creating crime investigation scenarios. Generate a detailed crime scenario with the following structure:
1. A title for the case
2. A scenario description with setting, crime details, and background (200-300 words)
3. 4-6 characters involved in the case, each with a name and brief description
4. A conversation between the characters with at least 10 exchanges, where subtle clues are hidden
5. Indicate who the culprit is (but don't reveal this in the conversation)

The difficulty level is: ${difficulty}
For easy: Make the clues fairly obvious
For medium: Make the clues somewhat subtle but logical
For hard: Make the clues very subtle and include some misdirection

Respond in JSON format like this:
{
  "title": "Case title",
  "scenario": "Full scenario description",
  "characters": [
    {"name": "Character Name", "description": "Brief description"},
    ...
  ],
  "conversations": [
    {"speaker": "Character Name", "text": "What they say"},
    ...
  ],
  "culprit": "Name of the guilty character"
}
`;

  try {
    const response = await chatWithCohere("Generate a new crime scenario", systemPrompt);
    
    // Parse the JSON response
    // The response might contain markdown code block indicators, so we need to clean it up
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(cleanedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error("Error generating crime scenario:", error);
    toast.error("Failed to generate crime scenario");
    
    // Return a fallback scenario
    return {
      title: "Error in Case Generation",
      scenario: "We're having trouble connecting to our mystery writing AI. Please try again later.",
      characters: [{ name: "System", description: "Error occurred" }],
      conversations: [{ speaker: "System", text: "Error generating conversation" }],
      culprit: "Unknown"
    };
  }
}

export async function evaluateDeduction(
  scenario: any,
  userDeduction: string
): Promise<{
  correct: boolean;
  feedback: string;
  reasoning: string;
}> {
  const systemPrompt = `
You are an expert detective evaluating a user's deduction for a crime scenario.

The crime scenario is:
${JSON.stringify(scenario)}

The user's deduction is:
"${userDeduction}"

Evaluate if the user correctly identified the culprit and how sound their reasoning was.
Respond in JSON format:
{
  "correct": true/false,
  "feedback": "Brief feedback on their overall deduction (50-100 words)",
  "reasoning": "Detailed analysis of their reasoning (100-200 words)"
}
`;

  try {
    const response = await chatWithCohere("Evaluate user deduction", systemPrompt);
    
    // Parse the JSON response
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(cleanedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error("Error evaluating deduction:", error);
    toast.error("Failed to evaluate your deduction");
    
    // Return a fallback evaluation
    return {
      correct: false,
      feedback: "We couldn't evaluate your deduction due to a technical issue.",
      reasoning: "Please try submitting your deduction again later."
    };
  }
}
