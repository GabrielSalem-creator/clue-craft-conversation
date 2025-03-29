
import React, { useState } from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { FileText, MessageSquare, CheckCircle } from "lucide-react";

const DeductionScreen: React.FC = () => {
  const { gameState, updateUserDeduction, submitDeduction, moveToPhase } = useGameContext();
  const { activeCase, userDeduction } = gameState;
  const [isReviewing, setIsReviewing] = useState(false);
  
  if (!activeCase) {
    return <div>No active case found</div>;
  }
  
  const handleReviewEvidence = () => {
    setIsReviewing(!isReviewing);
  };
  
  const characterOptions = activeCase.characters.map(char => char.name);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {isReviewing ? (
        <div className="space-y-6">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-amber-700" />
              <h2 className="font-serif text-xl font-bold text-amber-700">Case File: {activeCase.title}</h2>
            </div>
            <div className="paper-bg rounded-md p-4 text-gray-800 text-sm">
              {activeCase.scenario.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </Card>
          
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 mr-2 text-amber-700" />
              <h2 className="font-serif text-xl font-bold text-amber-700">Interview Transcripts</h2>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {activeCase.conversations.map((conversation, idx) => {
                const isCharacter = activeCase.characters.some(
                  char => char.name === conversation.speaker
                );
                
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-md ${isCharacter ? 'bg-blue-800' : 'bg-red-700'} bg-opacity-80 text-white`}
                  >
                    <div className="font-bold text-sm mb-1">{conversation.speaker}</div>
                    <div className="text-xs">{conversation.text}</div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          <div className="flex justify-center">
            <Button
              onClick={handleReviewEvidence}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
            >
              Return to Deduction
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-amber-700 mb-6">Make Your Deduction</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-lg font-bold text-gray-800">
                  Who is the culprit and why?
                </label>
                <p className="text-gray-600 mb-4 text-sm">
                  Explain your reasoning in detail. What clues led you to this conclusion? 
                  What inconsistencies did you notice in the statements?
                </p>
                <Textarea
                  className="min-h-[200px] bg-white border-gray-300"
                  value={userDeduction}
                  onChange={(e) => updateUserDeduction(e.target.value)}
                  placeholder="I believe the culprit is... because..."
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handleReviewEvidence}
                className="border-gray-300 text-gray-700"
              >
                Review Evidence
              </Button>
              
              <Button
                onClick={submitDeduction}
                disabled={!userDeduction || userDeduction.length < 20}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Deduction
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeductionScreen;
