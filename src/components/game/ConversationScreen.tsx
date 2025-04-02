
import React, { useState, useEffect } from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Brain, ArrowRight, ArrowLeft, RefreshCw, FileText, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ConversationScreen: React.FC = () => {
  const { gameState, moveToPhase } = useGameContext();
  const { activeCase } = gameState;
  const [visibleConversations, setVisibleConversations] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [displayIndex, setDisplayIndex] = useState<number>(0);

  useEffect(() => {
    if (!activeCase) return;
    
    // Auto-reveal the first message
    const timer = setTimeout(() => {
      setVisibleConversations(1);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeCase]);

  useEffect(() => {
    if (!activeCase || visibleConversations >= activeCase.conversations.length) {
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    const timer = setTimeout(() => {
      setVisibleConversations((prev) => prev + 1);
      setIsTyping(false);
    }, 1500); // Time to "type" each message
    
    return () => clearTimeout(timer);
  }, [visibleConversations, activeCase]);

  if (!activeCase) {
    return <div>Loading conversations...</div>;
  }

  const handleNext = () => {
    if (displayIndex < Math.ceil(activeCase.conversations.length / 4) - 1) {
      setDisplayIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (displayIndex > 0) {
      setDisplayIndex(prev => prev - 1);
    }
  };

  const handleRevealAll = () => {
    setVisibleConversations(activeCase.conversations.length);
    setIsTyping(false);
  };

  const currentConversations = activeCase.conversations.slice(
    displayIndex * 4,
    (displayIndex + 1) * 4
  );

  const hasMoreConversations = (displayIndex + 1) * 4 < activeCase.conversations.length;
  const hasPrevConversations = displayIndex > 0;
  const allConversationsVisible = visibleConversations >= activeCase.conversations.length;
  
  const visibleCurrentConversations = currentConversations.filter((_, idx) => {
    const absoluteIdx = displayIndex * 4 + idx;
    return absoluteIdx < visibleConversations;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="scenario">Crime Scene</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="mt-0">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <h2 className="font-serif text-2xl font-bold text-amber-700 mb-4">
              Interview Transcripts
            </h2>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {visibleCurrentConversations.map((conversation, idx) => {
                  const absoluteIdx = displayIndex * 4 + idx;
                  const character = activeCase.characters.find(
                    char => char.name === conversation.speaker
                  );
                  const isCharacter = !!character;
                  
                  return (
                    <div 
                      key={absoluteIdx}
                      className={`p-4 rounded-md ${isCharacter ? 'bg-blue-800' : 'bg-red-700'} bg-opacity-80 text-white`}
                    >
                      <div className="font-bold mb-1">{conversation.speaker}</div>
                      {character && (
                        <div className="text-xs mb-2 text-blue-100 italic">
                          {character.description.substring(0, 80)}...
                        </div>
                      )}
                      <div>{conversation.text}</div>
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div className="text-gray-500 italic">Someone is speaking...</div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={!hasPrevConversations}
                className="text-gray-700 border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRevealAll}
                disabled={allConversationsVisible}
                className="text-amber-700 border-amber-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reveal All
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={!hasMoreConversations}
                className="text-gray-700 border-gray-300"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="characters" className="mt-0">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 mr-2 text-amber-700" />
              <h2 className="font-serif text-2xl font-bold text-amber-700">Characters Involved</h2>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 gap-4">
                {activeCase.characters.map((character, index) => (
                  <Card key={index} className="bg-slate-50 border border-gray-200 p-4">
                    <h3 className="font-serif font-bold text-lg mb-2 text-gray-800">{character.name}</h3>
                    <p className="text-gray-600">{character.description}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
        
        <TabsContent value="scenario" className="mt-0">
          <Card className="bg-white border border-amber-200 p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 mr-2 text-amber-700" />
              <h2 className="font-serif text-2xl font-bold text-amber-700">{activeCase.title}</h2>
            </div>
            
            <ScrollArea className="h-[400px] paper-bg rounded-md p-6 text-gray-800">
              <div className="prose prose-sm max-w-none">
                {activeCase.scenario.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          Study the conversations carefully. What subtle clues can you detect in their words?
        </p>
        <Button
          onClick={() => moveToPhase('deduction')}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold"
        >
          <Brain className="mr-2 h-4 w-4" />
          Make Your Deduction
        </Button>
      </div>
    </div>
  );
};

export default ConversationScreen;
