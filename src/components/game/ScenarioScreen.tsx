
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { FileText, Users, MessageSquare, MapPin, AlertTriangle, BookOpen, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const ScenarioScreen: React.FC = () => {
  const { gameState, moveToPhase } = useGameContext();
  const { activeCase, language } = gameState;

  const texts = {
    en: {
      loading: "Loading case...",
      charactersInvolved: "Characters Involved",
      continueToInterviews: "Continue to Interviews",
      crimeScene: "Crime Scene",
      caseFile: "Case File",
      role: "Role",
      personality: "Personality",
      background: "Background",
      motives: "Potential Motives"
    },
    fr: {
      loading: "Chargement de l'affaire...",
      charactersInvolved: "Personnages impliqués",
      continueToInterviews: "Continuer vers les entretiens",
      crimeScene: "Scène de crime",
      caseFile: "Dossier de l'affaire",
      role: "Rôle",
      personality: "Personnalité",
      background: "Contexte",
      motives: "Motivations potentielles"
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

  // Enhanced character detail extraction function
  const extractCharacterDetails = (description: string) => {
    // Split by sentence markers (period, exclamation, question mark followed by space)
    const sentences = description.split(/[.!?]\s+/);
    
    // First sentence usually contains role/occupation
    const roleText = sentences[0]?.trim() || "";
    
    // Find sentences that might indicate personality traits (typically contain descriptive adjectives)
    const personalityPatterns = /\b(is|seems|appears|described as|known to be|regarded as|considered)\b|\b(loyal|honest|deceitful|clever|intelligent|cunning|ambitious|reserved|outgoing|introverted|extroverted|creative|methodical|detailed|relaxed|tense|suspicious|trusting)\b/i;
    
    const personalitySentences = sentences.filter(sentence => 
      personalityPatterns.test(sentence) && sentence !== roleText
    );
    
    // Remaining sentences likely contain background info
    const backgroundSentences = sentences.filter(sentence => 
      sentence !== roleText && !personalitySentences.includes(sentence)
    );
    
    return {
      roleText,
      personalityText: personalitySentences.join('. '),
      backgroundText: backgroundSentences.join('. ')
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="scenario" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="scenario" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            {t.caseFile}
          </TabsTrigger>
          <TabsTrigger value="characters" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t.charactersInvolved}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scenario">
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
            
            <ScrollArea className="h-[350px] paper-bg rounded-md p-6 text-gray-800">
              <div className="prose prose-sm max-w-none">
                {activeCase.scenario.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
        
        <TabsContent value="characters">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 mr-2 text-amber-700" />
              <h2 className="font-serif text-2xl font-bold text-amber-700">{t.charactersInvolved}</h2>
            </div>
            
            <ScrollArea className="h-[350px] pr-2">
              <div className="grid grid-cols-1 gap-4">
                {activeCase.characters.map((character, index) => {
                  const { roleText, personalityText, backgroundText } = extractCharacterDetails(character.description);
                  
                  return (
                    <Card key={index} className="bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 rounded-full p-3">
                          <User className="h-6 w-6 text-amber-700" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg mb-3 text-gray-800 border-b pb-2">{character.name}</h3>
                          
                          <div className="space-y-3 text-sm">
                            {roleText && (
                              <div>
                                <span className="font-semibold text-amber-700">{t.role}: </span>
                                <span className="text-gray-700">{roleText}</span>
                              </div>
                            )}
                            
                            {personalityText && (
                              <div>
                                <span className="font-semibold text-amber-700">{t.personality}: </span>
                                <span className="text-gray-600">{personalityText}</span>
                              </div>
                            )}
                            
                            {backgroundText && (
                              <div>
                                <span className="font-semibold text-amber-700">{t.background}: </span>
                                <span className="text-gray-600">{backgroundText}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
      
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
