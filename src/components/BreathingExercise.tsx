import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const exercises = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    pattern: [4, 7, 8],
    phases: ["Inhale", "Hold", "Exhale"]
  },
  {
    name: "Box Breathing",
    description: "Inhale 4, hold 4, exhale 4, hold 4",
    pattern: [4, 4, 4, 4],
    phases: ["Inhale", "Hold", "Exhale", "Hold"]
  },
  {
    name: "Simple Breathing",
    description: "Inhale for 4, exhale for 6",
    pattern: [4, 6],
    phases: ["Inhale", "Exhale"]
  }
];

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedExercise.pattern[0]);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const nextPhase = (currentPhase + 1) % selectedExercise.pattern.length;
      if (nextPhase === 0) {
        setCycleCount(cycleCount + 1);
      }
      setCurrentPhase(nextPhase);
      setTimeLeft(selectedExercise.pattern[nextPhase]);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, selectedExercise, cycleCount]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setTimeLeft(selectedExercise.pattern[0]);
    setCycleCount(0);
  };

  const currentPhaseText = selectedExercise.phases[currentPhase];
  const circleScale = currentPhaseText === "Inhale" ? 1.2 : currentPhaseText === "Exhale" ? 0.8 : 1;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4">Breathing Exercises</h3>
        
        <div className="grid gap-3 mb-6">
          {exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedExercise(exercise);
                resetBreathing();
              }}
              className={`p-3 text-left rounded-lg border transition-colors ${
                selectedExercise.name === exercise.name
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div>{exercise.name}</div>
              <div className="text-sm text-muted-foreground">{exercise.description}</div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-6">
            <motion.div
              className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
              animate={{ scale: circleScale }}
              transition={{ duration: timeLeft, ease: "easeInOut" }}
            >
              <div className="text-white">
                <div className="text-xl mb-1">{currentPhaseText}</div>
                <div className="text-2xl">{timeLeft}</div>
              </div>
            </motion.div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-1">Cycles completed</div>
            <div className="text-xl">{cycleCount}</div>
          </div>

          <div className="flex justify-center gap-3">
            <Button onClick={toggleBreathing} size="lg">
              {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetBreathing} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <h4 className="mb-3 text-green-900 dark:text-green-100">Mindfulness Tips</h4>
        <ul className="space-y-2 text-green-800 dark:text-green-200">
          <li>• Find a quiet, comfortable place to sit</li>
          <li>• Close your eyes or soften your gaze</li>
          <li>• Focus on the sensation of breathing</li>
          <li>• If your mind wanders, gently return to your breath</li>
          <li>• Start with just a few cycles and build up gradually</li>
        </ul>
      </Card>
    </div>
  );
}