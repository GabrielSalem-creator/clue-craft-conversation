
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DifficultyLevel, generateCrimeScenario, evaluateDeduction } from "../services/aiService";
import { toast } from "sonner";

// Define the data structure for our game state
interface GameState {
  activeCase: {
    title: string;
    scenario: string;
    characters: Array<{ name: string; description: string }>;
    conversations: Array<{ speaker: string; text: string }>;
    culprit: string;
  } | null;
  isLoading: boolean;
  difficulty: DifficultyLevel;
  gamePhase: 'start' | 'scenario' | 'conversation' | 'deduction' | 'result';
  userDeduction: string;
  evaluationResult: {
    correct: boolean;
    feedback: string;
    reasoning: string;
  } | null;
}

interface GameContextProps {
  gameState: GameState;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  generateNewCase: () => Promise<void>;
  updateUserDeduction: (deduction: string) => void;
  submitDeduction: () => Promise<void>;
  moveToPhase: (phase: GameState['gamePhase']) => void;
  resetGame: () => void;
}

// Create the context with default values
const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    activeCase: null,
    isLoading: false,
    difficulty: 'medium',
    gamePhase: 'start',
    userDeduction: '',
    evaluationResult: null
  });

  const setDifficulty = (difficulty: DifficultyLevel) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  const generateNewCase = async () => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    try {
      const newCase = await generateCrimeScenario(gameState.difficulty);
      setGameState(prev => ({
        ...prev,
        activeCase: newCase,
        isLoading: false,
        gamePhase: 'scenario',
        userDeduction: '',
        evaluationResult: null
      }));
      toast.success("New case generated successfully!");
    } catch (error) {
      console.error("Error generating case:", error);
      toast.error("Failed to generate a new case");
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateUserDeduction = (deduction: string) => {
    setGameState(prev => ({ ...prev, userDeduction: deduction }));
  };

  const submitDeduction = async () => {
    if (!gameState.activeCase || gameState.userDeduction.trim().length < 20) {
      toast.error("Please provide a more detailed deduction");
      return;
    }

    setGameState(prev => ({ ...prev, isLoading: true }));
    try {
      const evaluation = await evaluateDeduction(gameState.activeCase, gameState.userDeduction);
      setGameState(prev => ({
        ...prev,
        evaluationResult: evaluation,
        isLoading: false,
        gamePhase: 'result'
      }));
    } catch (error) {
      console.error("Error evaluating deduction:", error);
      toast.error("Failed to evaluate your deduction");
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const moveToPhase = (phase: GameState['gamePhase']) => {
    setGameState(prev => ({ ...prev, gamePhase: phase }));
  };

  const resetGame = () => {
    setGameState({
      activeCase: null,
      isLoading: false,
      difficulty: gameState.difficulty,  // Keep the existing difficulty
      gamePhase: 'start',
      userDeduction: '',
      evaluationResult: null
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setDifficulty,
        generateNewCase,
        updateUserDeduction,
        submitDeduction,
        moveToPhase,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
