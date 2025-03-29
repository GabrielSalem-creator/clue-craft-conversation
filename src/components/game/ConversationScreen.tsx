
import React, { useState, useEffect } from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Brain, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

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
      <Card className="bg-noir-dark border border-noir-gold/30 p-6 shadow-lg">
        <h2 className="font-serif text-2xl font-bold text-noir-gold mb-4">
          Interview Transcripts
        </h2>
        
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {visibleCurrentConversations.map((conversation, idx) => {
              const absoluteIdx = displayIndex * 4 + idx;
              const isCharacter = activeCase.characters.some(
                char => char.name === conversation.speaker
              );
              
              return (
                <div 
                  key={absoluteIdx}
                  className={`conversation-bubble ${isCharacter ? 'character' : 'suspect'}`}
                >
                  <div className="font-bold mb-1">{conversation.speaker}</div>
                  <div>{conversation.text}</div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="text-noir-muted italic">Someone is speaking...</div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!hasPrevConversations}
            className="text-noir-paper border-noir-muted/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRevealAll}
            disabled={allConversationsVisible}
            className="text-noir-gold border-noir-gold/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reveal All
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!hasMoreConversations}
            className="text-noir-paper border-noir-muted/50"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      <div className="text-center mt-8">
        <p className="text-noir-paper/70 mb-4">
          Study the conversations carefully. What subtle clues can you detect in their words?
        </p>
        <Button
          onClick={() => moveToPhase('deduction')}
          className="bg-noir-gold hover:bg-noir-gold/80 text-noir-dark font-bold"
        >
          <Brain className="mr-2 h-4 w-4" />
          Make Your Deduction
        </Button>
      </div>
    </div>
  );
};

export default ConversationScreen;
