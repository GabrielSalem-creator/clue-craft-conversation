
import React from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Brain, ScrollText, Users, Languages } from "lucide-react";

const HomeScreen: React.FC = () => {
  const { gameState, setDifficulty, generateNewCase, setLanguage } = useGameContext();
  const { language } = gameState;

  const difficultyOptions = language === 'en' ? [
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
  ] : [
    {
      level: 'easy' as const,
      name: 'Débutant',
      description: 'Indices clairs et déductions simples. Parfait pour les nouveaux détectives.',
      color: 'bg-green-600'
    },
    {
      level: 'medium' as const,
      name: 'Expérimenté',
      description: 'Indices plus subtils nécessitant une analyse attentive. Pour enquêteurs chevronnés.',
      color: 'bg-amber-600'
    },
    {
      level: 'hard' as const,
      name: 'Maître',
      description: 'Mystères complexes avec fausses pistes et détails cachés. Uniquement pour les prodiges de la détection.',
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-amber-700">
          {language === 'en' ? 'Clue Craft' : 'Maître du Mystère'}
        </h1>
        <p className="text-xl mb-6 text-gray-700">
          {language === 'en' 
            ? 'Test your detective skills with AI-generated crime scenarios' 
            : 'Testez vos compétences de détective avec des scénarios criminels générés par IA'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-amber-700" />
            <span>{language === 'en' ? 'Sharpen Analytical Skills' : 'Affiner les compétences analytiques'}</span>
          </div>
          <div className="flex items-center">
            <ScrollText className="h-5 w-5 mr-2 text-amber-700" />
            <span>{language === 'en' ? 'Unique Cases Every Time' : 'Cas uniques à chaque fois'}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-amber-700" />
            <span>{language === 'en' ? 'Realistic Character Dialogues' : 'Dialogues de personnages réalistes'}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            className={`px-6 py-2 ${language === 'en' ? 'bg-amber-700' : 'bg-gray-300 text-gray-800'}`}
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
          <Button
            className={`px-6 py-2 ${language === 'fr' ? 'bg-amber-700' : 'bg-gray-300 text-gray-800'}`}
            onClick={() => setLanguage('fr')}
          >
            Français
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-4xl">
        <h2 className="font-serif text-2xl font-bold mb-4 text-center text-gray-800">
          {language === 'en' ? 'Select Difficulty Level' : 'Sélectionnez le niveau de difficulté'}
        </h2>
        
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
        {gameState.isLoading 
          ? (language === 'en' ? "Generating Case..." : "Génération de l'affaire...") 
          : (language === 'en' ? "Start Investigation" : "Commencer l'enquête")}
      </Button>
    </div>
  );
};

export default HomeScreen;
