import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { DailyQuote } from './DailyQuote';
import { ChevronRight, Calendar, BookOpen, Heart, Target } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const [stats, setStats] = useState({
    journalEntries: 0,
    moodEntries: 0,
    currentStreak: 0,
    todayCompleted: {
      journal: false,
      mood: false,
    }
  });

  useEffect(() => {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    const today = new Date().toDateString();
    const todayJournal = journalEntries.some((entry: any) => entry.date === today);
    const todayMood = moodEntries.some((entry: any) => entry.date === today);
    
    // Calculate current streak (simplified)
    const journalDates = journalEntries.map((e: any) => e.date);
    const currentStreak = calculateStreak(journalDates);

    setStats({
      journalEntries: journalEntries.length,
      moodEntries: moodEntries.length,
      currentStreak,
      todayCompleted: {
        journal: todayJournal,
        mood: todayMood,
      }
    });
  }, []);

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    const today = new Date();
    const sortedDates = dates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date(today);

    for (const entryDate of sortedDates) {
      const diffTime = currentDate.getTime() - entryDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate = new Date(entryDate);
      } else {
        break;
      }
    }

    return streak;
  };

  const quickActions = [
    {
      title: "Write in Journal",
      description: "Capture your thoughts",
      icon: BookOpen,
      action: () => setActiveTab('journal'),
      completed: stats.todayCompleted.journal,
    },
    {
      title: "Mood Check-in",
      description: "Track how you're feeling",
      icon: Heart,
      action: () => setActiveTab('mood'),
      completed: stats.todayCompleted.mood,
    },
    {
      title: "Breathing Exercise",
      description: "Take a mindful moment",
      icon: Target,
      action: () => setActiveTab('breathe'),
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2">Welcome to Your Wellness Journey</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <DailyQuote />

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl mb-1">{stats.journalEntries}</div>
          <div className="text-sm text-muted-foreground">Journal Entries</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl mb-1">{stats.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Today's Activities</h3>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                  <action.icon className={`w-5 h-5 ${action.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    {action.title}
                    {action.completed && <span className="text-green-600">✓</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <h4 className="mb-3 text-blue-900 dark:text-blue-100">Wellness Tips</h4>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li>• Take regular breaks to check in with yourself</li>
          <li>• Practice gratitude by writing down 3 things you appreciate</li>
          <li>• Remember that small, consistent actions create lasting change</li>
          <li>• Be kind to yourself on difficult days</li>
        </ul>
      </Card>
    </div>
  );
}