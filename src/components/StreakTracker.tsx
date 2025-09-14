import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Award, Flame, Target, BookOpen, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export function StreakTracker() {
  const [streaks, setStreaks] = useState({
    journal: 0,
    mood: 0,
    breathing: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    calculateStreaks();
    updateAchievements();
  }, []);

  const calculateStreaks = () => {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const breathingData = JSON.parse(localStorage.getItem('breathingStats') || '{}');

    // Calculate journal streak
    const journalStreak = calculateConsecutiveDays(journalEntries.map((e: any) => e.date));
    
    // Calculate mood streak
    const moodStreak = calculateConsecutiveDays(moodEntries.map((e: any) => e.date));

    // Calculate breathing streak (simplified - would need actual tracking)
    const breathingStreak = 0; // Placeholder

    setStreaks({
      journal: journalStreak,
      mood: moodStreak,
      breathing: breathingStreak,
    });
  };

  const calculateConsecutiveDays = (dates: string[]): number => {
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
      } else if (diffDays === streak + 1 && streak === 0) {
        // Allow for missing today if we're just starting
        streak++;
        currentDate = new Date(entryDate);
      } else {
        break;
      }
    }

    return streak;
  };

  const updateAchievements = () => {
    const baseAchievements: Achievement[] = [
      {
        id: 'journal-1',
        title: 'First Entry',
        description: 'Write your first journal entry',
        icon: '📝',
        earned: false,
      },
      {
        id: 'journal-7',
        title: 'Week Warrior',
        description: 'Journal for 7 consecutive days',
        icon: '🗓️',
        earned: false,
      },
      {
        id: 'journal-30',
        title: 'Monthly Master',
        description: 'Journal for 30 consecutive days',
        icon: '📚',
        earned: false,
      },
      {
        id: 'mood-1',
        title: 'Mood Tracker',
        description: 'Log your first mood check-in',
        icon: '😊',
        earned: false,
      },
      {
        id: 'mood-7',
        title: 'Emotion Expert',
        description: 'Track mood for 7 consecutive days',
        icon: '❤️',
        earned: false,
      },
      {
        id: 'breathing-1',
        title: 'Breath Beginner',
        description: 'Complete your first breathing exercise',
        icon: '🫁',
        earned: false,
      },
      {
        id: 'wellbeing-week',
        title: 'Wellness Week',
        description: 'Use the app for 7 consecutive days',
        icon: '🌟',
        earned: false,
      },
    ];

    // Check achievements
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const savedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');

    const updatedAchievements = baseAchievements.map(achievement => {
      const saved = savedAchievements.find((a: Achievement) => a.id === achievement.id);
      if (saved?.earned) {
        return saved;
      }

      let earned = false;
      const earnedDate = new Date().toDateString();

      switch (achievement.id) {
        case 'journal-1':
          earned = journalEntries.length >= 1;
          break;
        case 'journal-7':
          earned = streaks.journal >= 7;
          break;
        case 'journal-30':
          earned = streaks.journal >= 30;
          break;
        case 'mood-1':
          earned = moodEntries.length >= 1;
          break;
        case 'mood-7':
          earned = streaks.mood >= 7;
          break;
        case 'wellbeing-week':
          earned = Math.min(streaks.journal, streaks.mood) >= 7;
          break;
      }

      return {
        ...achievement,
        earned,
        earnedDate: earned ? earnedDate : undefined,
      };
    });

    setAchievements(updatedAchievements);
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievements = achievements.filter(a => !a.earned).slice(0, 3);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-6">Current Streaks</h3>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <div>Journal Streak</div>
                <div className="text-sm text-muted-foreground">Consecutive days writing</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xl">{streaks.journal}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-600" />
              <div>
                <div>Mood Tracking Streak</div>
                <div className="text-sm text-muted-foreground">Consecutive mood check-ins</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xl">{streaks.mood}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Achievements</h3>
        
        {earnedAchievements.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-green-600">Earned ({earnedAchievements.length})</h4>
            <div className="grid gap-3">
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{achievement.title}</span>
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary">
                    {achievement.earnedDate && new Date(achievement.earnedDate).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextAchievements.length > 0 && (
          <div>
            <h4 className="mb-3 text-muted-foreground">Next Goals</h4>
            <div className="grid gap-3">
              {nextAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 border border-border rounded-lg opacity-60">
                  <span className="text-2xl grayscale">{achievement.icon}</span>
                  <div>
                    <div>{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}