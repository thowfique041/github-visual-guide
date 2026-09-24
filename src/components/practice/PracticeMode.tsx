import React, { useState } from 'react';
import { QUIZ_SCENARIOS } from '../../data/quizScenarios';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

export const PracticeMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuiz = QUIZ_SCENARIOS[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);
    const chosenOpt = currentQuiz.options.find(o => o.id === selectedOptionId);
    if (chosenOpt && chosenOpt.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const chosenOption = currentQuiz?.options.find(o => o.id === selectedOptionId);
  const correctOption = currentQuiz?.options.find(o => o.isCorrect);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#238636]/10 text-[#3fb950] border border-[#238636]/20">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Practice &amp; Scenarios</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            Test your real-world Git intuition. Solve daily developer dilemmas and see immediate explanations.
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d] self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restart Quiz
        </button>
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
              <span>Scenario {currentIndex + 1} of {QUIZ_SCENARIOS.length}</span>
              <span>Score: <strong className="text-white">{score}</strong> / {currentIndex + (hasSubmitted ? 1 : 0)}</span>
            </div>
            <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]">
              <div 
                className="bg-gradient-to-r from-[#238636] to-[#58a6ff] h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_SCENARIOS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario Box */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#21262d] text-[#58a6ff] px-2 py-0.5 rounded border border-[#30363d]">
                {currentQuiz.category}
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded border border-[#30363d]">
                {currentQuiz.difficulty}
              </span>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">
              {currentQuiz.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed bg-[#161b22] p-3.5 rounded-lg border border-[#30363d]/60">
              {currentQuiz.scenario}
            </p>

            <h4 className="text-sm font-semibold text-white pt-2">
              {currentQuiz.question}
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuiz.options.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              let optStyle = 'bg-[#0d1117] border-[#30363d] hover:border-[#58a6ff]/50 text-white';

              if (hasSubmitted) {
                if (opt.isCorrect) {
                  optStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold';
                } else if (isSelected && !opt.isCorrect) {
                  optStyle = 'bg-red-500/10 border-red-500 text-red-300';
                } else {
                  optStyle = 'bg-[#0d1117]/50 border-[#30363d]/50 text-[#8b949e] opacity-50';
                }
              } else if (isSelected) {
                optStyle = 'bg-[#1f6feb]/20 border-[#1f6feb] text-white shadow-md shadow-[#1f6feb]/10 ring-1 ring-[#1f6feb]';
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm ${optStyle}`}
                >
                  <div className="w-5 h-5 rounded-md border border-current flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs">
                    {hasSubmitted && opt.isCorrect ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : hasSubmitted && isSelected && !opt.isCorrect ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      opt.id.split('-')[1].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 font-mono">
                    <code>{opt.text}</code>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Submit */}
          {hasSubmitted && (
            <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
              chosenOption?.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {chosenOption?.isCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#3fb950]" />
                    <span>Correct! Great Git intuition.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Incorrect. Here's why:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-[#c9d1d9]">
                {chosenOption?.explanation}
              </p>
              {!chosenOption?.isCorrect && correctOption && (
                <p className="text-xs text-[#3fb950] pt-1">
                  <strong>Right answer:</strong> {correctOption.explanation}
                </p>
              )}
            </div>
          )}

          {/* Submit / Next Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!hasSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white shadow transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1f6feb] hover:bg-[#388bfd] text-xs font-semibold text-white shadow transition-all"
              >
                <span>{currentIndex < QUIZ_SCENARIOS.length - 1 ? 'Next Scenario' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Scorecard */
        <div className="py-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#238636] to-[#58a6ff] mx-auto flex items-center justify-center shadow-xl shadow-[#58a6ff]/20">
            <Award className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Practice Challenge Completed!</h3>
            <p className="text-sm text-[#8b949e]">
              You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{QUIZ_SCENARIOS.length}</span> correct.
            </p>
          </div>

          <div className="inline-block p-4 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs font-mono">
            {score === QUIZ_SCENARIOS.length ? (
              <span className="text-[#3fb950] font-bold">🏆 Perfect score! You're a Git Master!</span>
            ) : score >= QUIZ_SCENARIOS.length / 2 ? (
              <span className="text-[#58a6ff] font-bold">👍 Solid understanding of Git workflows!</span>
            ) : (
              <span className="text-amber-400 font-bold">📚 Keep practicing with the interactive visualizers!</span>
            )}
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white shadow transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
