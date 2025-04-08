
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { FileText, Users, MessageSquare } from "lucide-react";

const ScenarioScreen: React.FC = () => {
  const { gameState, moveToPhase } = useGameContext();
  const { activeCase, language } = gameState;

  const texts = {
    en: {
      loading: "Loading case...",
      charactersInvolved: "Characters Involved",
      continueToInterviews: "Continue to Interviews"
    },
    fr: {
      loading: "Chargement de l'affaire...",
      charactersInvolved: "Personnages impliqués",
      continueToInterviews: "Continuer vers les entretiens"
    }
  };

  const t = language === 'en' ? texts.en : texts.fr;

  if (!activeCase) {
    return <div>{t.loading}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white border border-amber-200 p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 mr-2 text-amber-700" />
          <h2 className="font-serif text-2xl font-bold text-amber-700">{activeCase.title}</h2>
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
          {activeCase.characters.map((character, index) => (
            <Card key={index} className="bg-white border border-gray-200 p-4">
              <h3 className="font-serif font-bold text-lg mb-1 text-gray-800">{character.name}</h3>
              <p className="text-sm text-gray-600">{character.description}</p>
            </Card>
          ))}
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
