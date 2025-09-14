import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  anxiety: number;
  notes?: string;
}

export function MoodTrends() {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const moodEntries: MoodEntry[] = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    const now = new Date();
    const daysBack = viewMode === 'week' ? 7 : 30;
    const data = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const entry = moodEntries.find(e => e.date === dateStr);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry?.mood || null,
        energy: entry?.energy || null,
        anxiety: entry?.anxiety || null,
      });
    }

    setChartData(data);
  }, [viewMode]);

  const averages = chartData.reduce(
    (acc, day) => {
      if (day.mood) acc.mood.push(day.mood);
      if (day.energy) acc.energy.push(day.energy);
      if (day.anxiety) acc.anxiety.push(day.anxiety);
      return acc;
    },
    { mood: [], energy: [], anxiety: [] } as { mood: number[], energy: number[], anxiety: number[] }
  );

  const avgMood = averages.mood.length > 0 ? (averages.mood.reduce((a, b) => a + b, 0) / averages.mood.length).toFixed(1) : 'N/A';
  const avgEnergy = averages.energy.length > 0 ? (averages.energy.reduce((a, b) => a + b, 0) / averages.energy.length).toFixed(1) : 'N/A';
  const avgAnxiety = averages.anxiety.length > 0 ? (averages.anxiety.reduce((a, b) => a + b, 0) / averages.anxiety.length).toFixed(1) : 'N/A';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3>Mood Trends</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl mb-1">{avgMood}</div>
          <div className="text-sm text-muted-foreground">Avg Mood</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl mb-1">{avgEnergy}</div>
          <div className="text-sm text-muted-foreground">Avg Energy</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl mb-1">{avgAnxiety}</div>
          <div className="text-sm text-muted-foreground">Avg Anxiety</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Mood"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Energy"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="anxiety" 
              stroke="#ffc658" 
              strokeWidth={2}
              name="Anxiety"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {chartData.every(day => !day.mood) && (
        <div className="text-center text-muted-foreground mt-4">
          Start logging your mood to see trends here!
        </div>
      )}
    </Card>
  );
}