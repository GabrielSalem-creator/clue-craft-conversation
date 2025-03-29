
import React from "react";
import { useGameContext } from "../contexts/GameContext";
import GameLayout from "./layout/GameLayout";
import HomeScreen from "./home/HomeScreen";
import ScenarioScreen from "./game/ScenarioScreen";
import ConversationScreen from "./game/ConversationScreen";
import DeductionScreen from "./game/DeductionScreen";
import ResultScreen from "./game/ResultScreen";
import { Loader2 } from "lucide-react";

const GameManager: React.FC = () => {
  const { gameState } = useGameContext();
  const { gamePhase, isLoading } = gameState;

  // Show loading spinner when generating content
  if (isLoading) {
    return (
      <GameLayout phase={gamePhase}>
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-700" />
          <p className="mt-4 text-gray-600">
            {gamePhase === 'start' ? 'Generating your crime scenario...' : 
             gamePhase === 'deduction' ? 'Analyzing your deduction...' : 
             'Processing...'}
          </p>
        </div>
      </GameLayout>
    );
  }

  // Show appropriate screen based on game phase
  return (
    <GameLayout phase={gamePhase}>
      {gamePhase === 'start' && <HomeScreen />}
      {gamePhase === 'scenario' && <ScenarioScreen />}
      {gamePhase === 'conversation' && <ConversationScreen />}
      {gamePhase === 'deduction' && <DeductionScreen />}
      {gamePhase === 'result' && <ResultScreen />}
    </GameLayout>
  );
};

export default GameManager;
