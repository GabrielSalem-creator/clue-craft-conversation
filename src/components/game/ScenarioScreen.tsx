
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { FileText, Users, MessageSquare } from "lucide-react";

const ScenarioScreen: React.FC = () => {
  const { gameState, moveToPhase } = useGameContext();
  const { activeCase } = gameState;

  if (!activeCase) {
    return <div>Loading case...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-noir-dark border border-noir-gold/30 p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 mr-2 text-noir-gold" />
          <h2 className="font-serif text-2xl font-bold text-noir-gold">{activeCase.title}</h2>
        </div>
        
        <ScrollArea className="h-[300px] paper-bg rounded-md p-6 text-noir-dark">
          <div className="prose prose-sm max-w-none">
            {activeCase.scenario.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </Card>
      
      <div>
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 mr-2 text-noir-gold" />
          <h2 className="font-serif text-2xl font-bold text-noir-gold">Characters Involved</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCase.characters.map((character, index) => (
            <Card key={index} className="bg-noir-dark/80 border border-noir-muted/30 p-4">
              <h3 className="font-serif font-bold text-lg mb-1">{character.name}</h3>
              <p className="text-sm text-noir-paper/70">{character.description}</p>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => moveToPhase('conversation')}
          className="bg-noir-gold hover:bg-noir-gold/80 text-noir-dark font-bold"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Continue to Interviews
        </Button>
      </div>
    </div>
  );
};

export default ScenarioScreen;
