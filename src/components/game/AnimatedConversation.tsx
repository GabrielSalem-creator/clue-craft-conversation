import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

interface Character {
  name: string;
  description: string;
}

interface Conversation {
  speaker: string;
  text: string;
}

interface AnimatedConversationProps {
  conversations: Conversation[];
  characters: Character[];
  scenario: string;
  language: 'en' | 'fr';
}

const AnimatedConversation: React.FC<AnimatedConversationProps> = ({
  conversations,
  characters,
  scenario,
  language
}) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [currentDialogueIndex]);

  const handleNext = () => {
    if (currentDialogueIndex < conversations.length - 1) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentDialogueIndex(prev => prev + 1);
      }, 200);
    }
  };

  const getEnvironmentStyle = () => {
    const scenarioLower = scenario.toLowerCase();
    
    if (scenarioLower.includes('office') || scenarioLower.includes('bureau')) {
      return 'bg-gradient-to-b from-blue-100 to-gray-200';
    } else if (scenarioLower.includes('restaurant') || scenarioLower.includes('café')) {
      return 'bg-gradient-to-b from-orange-100 to-amber-200';
    } else if (scenarioLower.includes('park') || scenarioLower.includes('garden') || scenarioLower.includes('parc')) {
      return 'bg-gradient-to-b from-green-100 to-emerald-200';
    } else if (scenarioLower.includes('house') || scenarioLower.includes('home') || scenarioLower.includes('maison')) {
      return 'bg-gradient-to-b from-yellow-100 to-orange-200';
    } else if (scenarioLower.includes('hospital') || scenarioLower.includes('hôpital')) {
      return 'bg-gradient-to-b from-white to-blue-100';
    } else {
      return 'bg-gradient-to-b from-gray-100 to-slate-200';
    }
  };

  const getCharacterPosition = (index: number, total: number) => {
    const positions = [
      { left: '15%', top: '60%' },
      { left: '75%', top: '55%' },
      { left: '45%', top: '70%' },
      { left: '25%', top: '45%' },
      { left: '65%', top: '75%' }
    ];
    return positions[index % positions.length];
  };

  const getCharacterColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const currentConversation = conversations[currentDialogueIndex];
  const speakingCharacter = characters.find(char => char.name === currentConversation?.speaker);

  const texts = {
    en: { next: "Next", finish: "All dialogues complete" },
    fr: { next: "Suivant", finish: "Tous les dialogues terminés" }
  };
  const t = language === 'en' ? texts.en : texts.fr;

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      {/* Environment Background */}
      <div className={`absolute inset-0 ${getEnvironmentStyle()}`}>
        {/* Ground/Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-400/30 to-transparent" />
        
        {/* Environmental elements */}
        <div className="absolute inset-0">
          {scenario.toLowerCase().includes('office') && (
            <>
              <div className="absolute top-4 left-4 w-16 h-12 bg-gray-600 rounded-sm opacity-70" />
              <div className="absolute top-4 right-4 w-20 h-8 bg-green-600 rounded opacity-50" />
            </>
          )}
          {scenario.toLowerCase().includes('restaurant') && (
            <>
              <div className="absolute top-6 left-8 w-12 h-12 bg-brown-600 rounded-full opacity-60" />
              <div className="absolute top-6 right-8 w-12 h-12 bg-brown-600 rounded-full opacity-60" />
            </>
          )}
          {scenario.toLowerCase().includes('park') && (
            <>
              <div className="absolute top-2 left-6 w-8 h-16 bg-green-700 rounded-t-full opacity-70" />
              <div className="absolute top-2 right-6 w-8 h-16 bg-green-700 rounded-t-full opacity-70" />
              <div className="absolute top-4 center w-6 h-12 bg-green-700 rounded-t-full opacity-70" style={{left: '45%'}} />
            </>
          )}
        </div>
      </div>

      {/* Characters */}
      {characters.map((character, index) => {
        const position = getCharacterPosition(index, characters.length);
        const isCurrentSpeaker = character.name === currentConversation?.speaker;
        
        return (
          <div
            key={character.name}
            className="absolute transition-all duration-300"
            style={{ left: position.left, top: position.top }}
          >
            {/* Character Avatar */}
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-300 ${
                getCharacterColor(character.name)
              } ${isCurrentSpeaker ? 'scale-110 ring-4 ring-yellow-400' : 'scale-100'}`}
            >
              {character.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Character Name */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded whitespace-nowrap">
              {character.name}
            </div>
          </div>
        );
      })}

      {/* Speech Bubble */}
      {currentConversation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className={`relative bg-white rounded-lg shadow-xl p-4 max-w-xs mx-4 transform transition-all duration-300 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Speech bubble arrow */}
            <div className="absolute bottom-[-8px] left-6 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
            
            {/* Speaker name */}
            <div className="font-bold text-sm text-gray-800 mb-2">
              {currentConversation.speaker}
            </div>
            
            {/* Speech text */}
            <div className="text-sm text-gray-700 leading-relaxed">
              {currentConversation.text.length > 100 
                ? `${currentConversation.text.substring(0, 100)}...`
                : currentConversation.text
              }
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4">
        {currentDialogueIndex < conversations.length - 1 ? (
          <Button
            onClick={handleNext}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
          >
            {t.next}
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        ) : (
          <div className="text-sm text-gray-600 bg-white/80 px-3 py-2 rounded shadow">
            {t.finish}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 flex gap-1">
        {conversations.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index <= currentDialogueIndex ? 'bg-amber-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedConversation;