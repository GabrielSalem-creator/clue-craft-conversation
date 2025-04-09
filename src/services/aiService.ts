
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

export async function generateCrimeScenario(
  difficulty: DifficultyLevel, 
  language: 'en' | 'fr' = 'en'
): Promise<{
  title: string;
  scenario: string;
  characters: Array<{ name: string; description: string }>;
  conversations: Array<{ speaker: string; text: string }>;
  culprit: string;
}> {
  const englishPrompt = `
You are a master mystery writer creating extremely diverse crime investigation scenarios. I NEED MAXIMUM CREATIVITY. Every scenario should be radically different from any previous ones. Generate a unique and detailed crime scenario with the following structure:

1. Create a captivating title for the case that reflects its unique nature

2. A scenario description (200-300 words) that MUST include:
   - A highly specific and unusual location (avoid generic settings - instead use places like "an underwater research laboratory in the Mariana Trench", "a Bedouin desert camp during a rare meteor shower", "an avant-garde fashion show in an abandoned Soviet bunker", etc.)
   - An extremely original and unexpected crime (NO standard murders or thefts - instead create unusual crimes like "sabotage of a revolutionary clean energy invention", "theft of a previously unknown Picasso that has peculiar side effects on viewers", "manipulation of weather control technology for ransom", etc.)
   - At the beginning, clearly introduce each character with their name, role/occupation, and any notable personality traits
   - Rich atmospheric details that create a vivid sense of time, place, and mood

3. 4-6 characters involved in the case, each with:
   - A distinctive name reflecting varied cultural backgrounds
   - A detailed description that includes occupation, personality traits, unique background, and motivations
   - Unusual talents, flaws, or quirks that might be relevant to the case

4. A conversation between the characters with at least 10 exchanges, where subtle clues are hidden. This conversation should:
   - Reveal character relationships and tensions
   - Include natural-sounding dialogue that subtly hints at motives and opportunities
   - Contain red herrings and misdirections appropriate to the difficulty level

5. Indicate who the culprit is (but don't reveal this in the conversation)

The difficulty level is: ${difficulty}
For easy: Make the clues fairly obvious and the motive clear
For medium: Make the clues somewhat subtle but logical, with some misdirection
For hard: Make the clues very subtle, include multiple red herrings and complex motives

IMPORTANT: Ensure each scenario is completely different from any previous scenario. Vary the time periods, cultural settings, types of crimes, character professions, and motivations dramatically. Think beyond typical mystery tropes.

Respond in JSON format like this:
{
  "title": "Case title",
  "scenario": "Full scenario description",
  "characters": [
    {"name": "Character Name", "description": "Detailed description including their role/occupation, personality traits, and unique background"},
    ...
  ],
  "conversations": [
    {"speaker": "Character Name", "text": "What they say"},
    ...
  ],
  "culprit": "Name of the guilty character"
}
`;

  const frenchPrompt = `
Vous êtes un maître écrivain de mystères créant des scénarios d'enquête criminelle extrêmement divers. J'AI BESOIN D'UN MAXIMUM DE CRÉATIVITÉ. Chaque scénario doit être radicalement différent de tous les précédents. Générez un scénario criminel unique et détaillé avec la structure suivante :

1. Créez un titre captivant pour l'affaire qui reflète sa nature unique

2. Une description du scénario (200-300 mots) qui DOIT inclure :
   - Un lieu hautement spécifique et inhabituel (évitez les décors génériques - utilisez plutôt des lieux comme "un laboratoire de recherche sous-marin dans la fosse des Mariannes", "un campement bédouin dans le désert pendant une rare pluie de météores", "un défilé de mode avant-gardiste dans un bunker soviétique abandonné", etc.)
   - Un crime extrêmement original et inattendu (PAS de meurtres ou de vols standard - créez plutôt des crimes inhabituels comme "le sabotage d'une invention révolutionnaire d'énergie propre", "le vol d'un Picasso jusqu'alors inconnu qui a des effets secondaires particuliers sur les spectateurs", "la manipulation de la technologie de contrôle météorologique pour rançon", etc.)
   - Au début, présentez clairement chaque personnage avec son nom, son rôle/profession, et tout trait de personnalité notable
   - Détails atmosphériques riches qui créent un sentiment vivant de temps, de lieu et d'ambiance

3. 4-6 personnages impliqués dans l'affaire, chacun avec :
   - Un nom distinctif reflétant des origines culturelles variées
   - Une description détaillée incluant la profession, les traits de personnalité, un parcours unique et les motivations
   - Des talents, défauts ou particularités inhabituels qui pourraient être pertinents pour l'affaire

4. Une conversation entre les personnages avec au moins 10 échanges, où des indices subtils sont cachés. Cette conversation devrait :
   - Révéler les relations et tensions entre les personnages
   - Inclure un dialogue naturel qui suggère subtilement les motifs et les opportunités
   - Contenir des fausses pistes et des diversions appropriées au niveau de difficulté

5. Indiquez qui est le coupable (mais ne le révélez pas dans la conversation)

Le niveau de difficulté est : ${difficulty === 'easy' ? 'facile' : difficulty === 'medium' ? 'moyen' : 'difficile'}
Pour facile : Rendez les indices assez évidents et le mobile clair
Pour moyen : Rendez les indices quelque peu subtils mais logiques, avec quelques fausses pistes
Pour difficile : Rendez les indices très subtils, incluez plusieurs fausses pistes et des mobiles complexes

IMPORTANT : Assurez-vous que chaque scénario est complètement différent de tout scénario précédent. Variez radicalement les périodes, les contextes culturels, les types de crimes, les professions des personnages et les motivations. Pensez au-delà des tropes typiques du mystère.

Répondez au format JSON comme ceci :
{
  "title": "Titre de l'affaire",
  "scenario": "Description complète du scénario",
  "characters": [
    {"name": "Nom du personnage", "description": "Description détaillée incluant leur rôle/profession, traits de personnalité et parcours unique"},
    ...
  ],
  "conversations": [
    {"speaker": "Nom du personnage", "text": "Ce qu'ils disent"},
    ...
  ],
  "culprit": "Nom du personnage coupable"
}
`;

  const systemPrompt = language === 'en' ? englishPrompt : frenchPrompt;

  try {
    const response = await chatWithCohere("Generate a new crime scenario", systemPrompt);
    
    // Parse the JSON response
    // The response might contain markdown code block indicators, so we need to clean it up
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(cleanedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error("Error generating crime scenario:", error);
    const errorMessage = language === 'en' 
      ? "Failed to generate crime scenario" 
      : "Échec de la génération du scénario criminel";
    toast.error(errorMessage);
    
    // Return a fallback scenario
    return {
      title: language === 'en' ? "Error in Case Generation" : "Erreur dans la génération de l'affaire",
      scenario: language === 'en' 
        ? "We're having trouble connecting to our mystery writing AI. Please try again later."
        : "Nous avons des difficultés à nous connecter à notre IA d'écriture de mystères. Veuillez réessayer plus tard.",
      characters: [{ 
        name: "System", 
        description: language === 'en' ? "Error occurred" : "Une erreur s'est produite" 
      }],
      conversations: [{ 
        speaker: "System", 
        text: language === 'en' ? "Error generating conversation" : "Erreur lors de la génération de la conversation" 
      }],
      culprit: language === 'en' ? "Unknown" : "Inconnu"
    };
  }
}

export async function evaluateDeduction(
  scenario: any,
  userDeduction: string,
  language: 'en' | 'fr' = 'en'
): Promise<{
  correct: boolean;
  feedback: string;
  reasoning: string;
}> {
  const englishPrompt = `
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

  const frenchPrompt = `
Vous êtes un détective expert évaluant la déduction d'un utilisateur pour un scénario criminel.

Le scénario criminel est :
${JSON.stringify(scenario)}

La déduction de l'utilisateur est :
"${userDeduction}"

Évaluez si l'utilisateur a correctement identifié le coupable et si son raisonnement était solide.
Répondez au format JSON :
{
  "correct": true/false,
  "feedback": "Bref commentaire sur leur déduction globale (50-100 mots)",
  "reasoning": "Analyse détaillée de leur raisonnement (100-200 mots)"
}
`;

  const systemPrompt = language === 'en' ? englishPrompt : frenchPrompt;

  try {
    const response = await chatWithCohere("Evaluate user deduction", systemPrompt);
    
    // Parse the JSON response
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(cleanedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error("Error evaluating deduction:", error);
    const errorMessage = language === 'en'
      ? "Failed to evaluate your deduction"
      : "Échec de l'évaluation de votre déduction";
    toast.error(errorMessage);
    
    // Return a fallback evaluation
    return {
      correct: false,
      feedback: language === 'en'
        ? "We couldn't evaluate your deduction due to a technical issue."
        : "Nous n'avons pas pu évaluer votre déduction en raison d'un problème technique.",
      reasoning: language === 'en'
        ? "Please try submitting your deduction again later."
        : "Veuillez essayer de soumettre à nouveau votre déduction plus tard."
    };
  }
}
