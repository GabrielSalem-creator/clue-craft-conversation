
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Brain, ScrollText, Users } from "lucide-react";

const HomeScreen: React.FC = () => {
  const { gameState, setDifficulty, generateNewCase } = useGameContext();

  const difficultyOptions = [
    {
      level: 'easy' as const,
      name: 'Beginner',
      description: 'Clear clues and straightforward deductions. Perfect for new detectives.',
      color: 'bg-green-600'
    },
    {
      level: 'medium' as const,
      name: 'Experienced',
      description: 'More subtle clues that require careful analysis. For seasoned investigators.',
      color: 'bg-amber-600'
    },
    {
      level: 'hard' as const,
      name: 'Master',
      description: 'Complex mysteries with misdirection and hidden details. Only for detective prodigies.',
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-amber-700">
          Clue Craft
        </h1>
        <p className="text-xl mb-6 text-gray-700">
          Test your detective skills with AI-generated crime scenarios
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-amber-700" />
            <span>Sharpen Analytical Skills</span>
          </div>
          <div className="flex items-center">
            <ScrollText className="h-5 w-5 mr-2 text-amber-700" />
            <span>Unique Cases Every Time</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-amber-700" />
            <span>Realistic Character Dialogues</span>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl">
        <h2 className="font-serif text-2xl font-bold mb-4 text-center text-gray-800">Select Difficulty Level</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficultyOptions.map((option) => (
            <Card 
              key={option.level}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                gameState.difficulty === option.level 
                  ? 'border-amber-700 bg-white' 
                  : 'border-transparent bg-white/80'
              }`}
              onClick={() => setDifficulty(option.level)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-bold text-gray-800">{option.name}</h3>
                <Badge className={`${option.color}`}>{option.level}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
            </Card>
          ))}
        </div>
      </div>
      
      <Button 
        className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-8 text-lg"
        disabled={gameState.isLoading}
        onClick={generateNewCase}
      >
        {gameState.isLoading ? "Generating Case..." : "Start Investigation"}
      </Button>
    </div>
  );
};

export default HomeScreen;
