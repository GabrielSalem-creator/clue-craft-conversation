
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Sparkles, X, HomeIcon, RotateCw } from "lucide-react";

const ResultScreen: React.FC = () => {
  const { gameState, resetGame, generateNewCase } = useGameContext();
  const { activeCase, evaluationResult, userDeduction } = gameState;
  
  if (!activeCase || !evaluationResult) {
    return <div>Loading results...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white border border-amber-200 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-amber-700">
            Case Results: {activeCase.title}
          </h2>
          <Badge className={evaluationResult.correct ? 'bg-green-600' : 'bg-red-600'}>
            {evaluationResult.correct ? 'Correct' : 'Incorrect'}
          </Badge>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 border border-amber-100 rounded-md p-4">
            <h3 className="font-serif text-lg font-bold flex items-center mb-3 text-gray-800">
              <Sparkles className="h-5 w-5 mr-2 text-amber-700" />
              {evaluationResult.correct ? 'Brilliant Deduction!' : 'Not Quite Right'}
            </h3>
            <p className="text-gray-700">{evaluationResult.feedback}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-serif font-bold mb-2 text-gray-800">The Actual Culprit</h3>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-lg font-bold text-gray-800">{activeCase.culprit}</p>
              </div>
            </div>
            <div>
              <h3 className="font-serif font-bold mb-2 text-gray-800">Your Analysis</h3>
              <ScrollArea className="h-[100px] bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-700">{userDeduction}</p>
              </ScrollArea>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-serif text-lg font-bold mb-3 text-gray-800">Feedback on Your Reasoning</h3>
            <div className="paper-bg rounded-md p-4 text-gray-800">
              <p>{evaluationResult.reasoning}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center space-x-4">
        <Button
          onClick={resetGame}
          variant="outline"
          className="border-gray-300 text-gray-700"
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
        
        <Button
          onClick={generateNewCase}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Solve a New Case
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
