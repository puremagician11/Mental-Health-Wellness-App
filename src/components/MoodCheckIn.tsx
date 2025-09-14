import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const moodEmojis = [
  { emoji: '😢', label: 'Very Sad', value: 1 },
  { emoji: '😔', label: 'Sad', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😊', label: 'Happy', value: 4 },
  { emoji: '😄', label: 'Very Happy', value: 5 },
];

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  anxiety: number;
  notes?: string;
}

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState([3]);
  const [anxiety, setAnxiety] = useState([3]);
  const [notes, setNotes] = useState('');
  const [todayChecked, setTodayChecked] = useState(false);

  const today = new Date().toDateString();

  useEffect(() => {
    // Check if mood was already logged today
    const moodData = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const todayEntry = moodData.find((entry: MoodEntry) => entry.date === today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setEnergy([todayEntry.energy]);
      setAnxiety([todayEntry.anxiety]);
      setNotes(todayEntry.notes || '');
      setTodayChecked(true);
    }
  }, [today]);

  const saveMoodEntry = () => {
    if (selectedMood === null) return;

    const moodEntry: MoodEntry = {
      date: today,
      mood: selectedMood,
      energy: energy[0],
      anxiety: anxiety[0],
      notes: notes.trim(),
    };

    const existingData = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const filteredData = existingData.filter((entry: MoodEntry) => entry.date !== today);
    const updatedData = [...filteredData, moodEntry];
    
    localStorage.setItem('moodEntries', JSON.stringify(updatedData));
    setTodayChecked(true);
  };

  const selectedMoodEmoji = moodEmojis.find(m => m.value === selectedMood);

  return (
    <Card className="p-6">
      <h3 className="mb-4">Daily Mood Check-in</h3>
      
      {todayChecked && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">✓ Mood logged for today!</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block mb-3">How are you feeling today?</label>
          <div className="grid grid-cols-5 gap-2">
            {moodEmojis.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMood === mood.value
                    ? 'border-primary bg-accent scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-muted-foreground">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Energy Level: {energy[0]}/5</label>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Anxiety Level: {anxiety[0]}/5</label>
          <Slider
            value={anxiety}
            onValueChange={setAnxiety}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? What made you feel this way?"
            className="w-full p-3 border border-border rounded-lg bg-input-background resize-none"
            rows={3}
          />
        </div>

        <Button 
          onClick={saveMoodEntry} 
          disabled={selectedMood === null}
          className="w-full"
        >
          {todayChecked ? 'Update Mood Entry' : 'Save Mood Entry'}
        </Button>
      </div>
    </Card>
  );
}