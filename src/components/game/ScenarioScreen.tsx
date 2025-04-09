
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { FileText, Users, MessageSquare, MapPin, AlertTriangle } from "lucide-react";

const ScenarioScreen: React.FC = () => {
  const { gameState, moveToPhase } = useGameContext();
  const { activeCase, language } = gameState;

  const texts = {
    en: {
      loading: "Loading case...",
      charactersInvolved: "Characters Involved",
      continueToInterviews: "Continue to Interviews",
      crimeScene: "Crime Scene",
      role: "Role",
      personality: "Personality"
    },
    fr: {
      loading: "Chargement de l'affaire...",
      charactersInvolved: "Personnages impliqués",
      continueToInterviews: "Continuer vers les entretiens",
      crimeScene: "Scène de crime",
      role: "Rôle",
      personality: "Personnalité"
    }
  };

  const t = language === 'en' ? texts.en : texts.fr;

  if (!activeCase) {
    return <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-lg text-gray-700">{t.loading}</p>
      </div>
    </div>;
  }

  // Helper function to extract role and personality from description
  const extractCharacterDetails = (description: string) => {
    // This is a simplified approach - in a real app you might want more sophisticated parsing
    const parts = description.split(/[,.]\s+/);
    
    // Try to identify the role (usually mentioned early in the description)
    let roleText = parts[0];
    
    // The rest is likely personality and background details
    let personalityText = parts.slice(1).join('. ');
    
    return { roleText, personalityText };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white border border-amber-200 p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 mr-2 text-amber-700" />
          <h2 className="font-serif text-2xl font-bold text-amber-700">{activeCase.title}</h2>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-sm italic text-amber-600">
              {activeCase.scenario.split('.')[0]}.
            </p>
          </div>
        </div>
        
        <ScrollArea className="h-[300px] paper-bg rounded-md p-6 text-gray-800">
          <div className="prose prose-sm max-w-none">
            {activeCase.scenario.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </Card>
      
      <div>
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 mr-2 text-amber-700" />
          <h2 className="font-serif text-2xl font-bold text-amber-700">{t.charactersInvolved}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCase.characters.map((character, index) => {
            const { roleText, personalityText } = extractCharacterDetails(character.description);
            
            return (
              <Card key={index} className="bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h3 className="font-serif font-bold text-lg mb-2 text-gray-800">{character.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-amber-700">{t.role}: </span>
                    <span className="text-gray-700">{roleText}</span>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-amber-700">{t.personality}: </span>
                    <span className="text-gray-600">{personalityText}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => moveToPhase('conversation')}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {t.continueToInterviews}
        </Button>
      </div>
    </div>
  );
};

export default ScenarioScreen;
