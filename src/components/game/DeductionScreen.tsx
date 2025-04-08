
import React, { useState } from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { FileText, MessageSquare, CheckCircle, Users, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const DeductionScreen: React.FC = () => {
  const { gameState, updateUserDeduction, submitDeduction, moveToPhase } = useGameContext();
  const { activeCase, userDeduction, language } = gameState;
  const [isReviewing, setIsReviewing] = useState(false);
  
  if (!activeCase) {
    return <div>{language === 'en' ? 'No active case found' : 'Aucune affaire active trouvée'}</div>;
  }
  
  const handleReviewEvidence = () => {
    setIsReviewing(!isReviewing);
  };

  const returnToInvestigation = () => {
    moveToPhase('conversation');
  };
  
  const texts = {
    en: {
      caseFile: "Case File",
      interviews: "Interview Transcripts",
      characters: "Characters",
      makeDeduction: "Make Your Deduction",
      culpritQuestion: "Who is the culprit and why?",
      deductionHelp: "Explain your reasoning in detail. What clues led you to this conclusion? What inconsistencies did you notice in the statements?",
      deductionPlaceholder: "I believe the culprit is... because...",
      reviewEvidence: "Review Evidence",
      returnToDeduction: "Return to Deduction",
      returnToInterviews: "Return to Interviews",
      submit: "Submit Deduction"
    },
    fr: {
      caseFile: "Dossier d'affaire",
      interviews: "Transcriptions des entretiens",
      characters: "Personnages",
      makeDeduction: "Faites votre déduction",
      culpritQuestion: "Qui est le coupable et pourquoi ?",
      deductionHelp: "Expliquez votre raisonnement en détail. Quels indices vous ont mené à cette conclusion ? Quelles incohérences avez-vous remarquées dans les déclarations ?",
      deductionPlaceholder: "Je crois que le coupable est... parce que...",
      reviewEvidence: "Examiner les preuves",
      returnToDeduction: "Retourner à la déduction",
      returnToInterviews: "Retourner aux entretiens",
      submit: "Soumettre la déduction"
    }
  };
  
  const t = language === 'en' ? texts.en : texts.fr;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {isReviewing ? (
        <div className="space-y-6">
          <Tabs defaultValue="scenario" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="scenario">{t.caseFile}</TabsTrigger>
              <TabsTrigger value="interviews">{t.interviews}</TabsTrigger>
              <TabsTrigger value="characters">{t.characters}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scenario">
              <Card className="bg-white border border-amber-200 p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 mr-2 text-amber-700" />
                  <h2 className="font-serif text-xl font-bold text-amber-700">{activeCase.title}</h2>
                </div>
                <div className="paper-bg rounded-md p-4 text-gray-800 text-sm max-h-[400px] overflow-y-auto">
                  {activeCase.scenario.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="interviews">
              <Card className="bg-white border border-amber-200 p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-5 w-5 mr-2 text-amber-700" />
                  <h2 className="font-serif text-xl font-bold text-amber-700">{t.interviews}</h2>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
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
            </TabsContent>
            
            <TabsContent value="characters">
              <Card className="bg-white border border-amber-200 p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 mr-2 text-amber-700" />
                  <h2 className="font-serif text-xl font-bold text-amber-700">{t.characters}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {activeCase.characters.map((character, index) => (
                    <Card key={index} className="bg-white border border-gray-200 p-4">
                      <h3 className="font-serif font-bold text-lg mb-1 text-gray-800">{character.name}</h3>
                      <p className="text-sm text-gray-600">{character.description}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={returnToInvestigation}
              className="border-gray-300 text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.returnToInterviews}
            </Button>
            
            <Button
              onClick={handleReviewEvidence}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
            >
              {t.returnToDeduction}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-amber-700 mb-6">{t.makeDeduction}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-lg font-bold text-gray-800">
                  {t.culpritQuestion}
                </label>
                <p className="text-gray-600 mb-4 text-sm">
                  {t.deductionHelp}
                </p>
                <Textarea
                  className="min-h-[200px] bg-white border-gray-300"
                  value={userDeduction}
                  onChange={(e) => updateUserDeduction(e.target.value)}
                  placeholder={t.deductionPlaceholder}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handleReviewEvidence}
                className="border-gray-300 text-gray-700"
              >
                {t.reviewEvidence}
              </Button>
              
              <Button
                onClick={submitDeduction}
                disabled={!userDeduction || userDeduction.length < 20}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t.submit}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeductionScreen;
