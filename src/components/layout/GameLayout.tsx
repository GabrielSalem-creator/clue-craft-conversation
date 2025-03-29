
import React, { ReactNode } from "react";
import { Briefcase, FileSearch, Brain, Award } from "lucide-react";

interface GameLayoutProps {
  children: ReactNode;
  phase: 'start' | 'scenario' | 'conversation' | 'deduction' | 'result';
}

const GameLayout: React.FC<GameLayoutProps> = ({ children, phase }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b border-noir-muted/30">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-noir-gold italic mb-2 md:mb-0">
            Clue Craft
          </h1>
          <div className="flex items-center space-x-6 text-sm text-noir-muted">
            <div className={`flex items-center ${phase === 'scenario' || phase === 'conversation' || phase === 'deduction' || phase === 'result' ? 'text-noir-gold' : ''}`}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Case</span>
            </div>
            <div className={`flex items-center ${phase === 'conversation' || phase === 'deduction' || phase === 'result' ? 'text-noir-gold' : ''}`}>
              <FileSearch className="mr-2 h-4 w-4" />
              <span>Interviews</span>
            </div>
            <div className={`flex items-center ${phase === 'deduction' || phase === 'result' ? 'text-noir-gold' : ''}`}>
              <Brain className="mr-2 h-4 w-4" />
              <span>Deduction</span>
            </div>
            <div className={`flex items-center ${phase === 'result' ? 'text-noir-gold' : ''}`}>
              <Award className="mr-2 h-4 w-4" />
              <span>Result</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-8 px-4 md:px-8">
        {children}
      </main>
      
      <footer className="py-6 px-8 border-t border-noir-muted/30 text-center text-sm text-noir-muted">
        <p>© 2023 Clue Craft - AI-Powered Crime Investigation Game</p>
      </footer>
    </div>
  );
};

export default GameLayout;
