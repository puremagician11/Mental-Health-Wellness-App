import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { Card } from './ui/card';

const quotes = [
  "The present moment is the only time over which we have dominion. - Thich Nhat Hanh",
  "You are not your illness. You have an individual story to tell. - Julian Seifter",
  "Your current situation is not your final destination. The best is yet to come.",
  "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
  "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
  "Healing isn't about changing who you are; it's about changing your relationship with who you are.",
  "You are stronger than you think and more resilient than you realize.",
  "Progress, not perfection. Every small step counts.",
  "Be patient with yourself. Self-growth is tender; it's holy ground. There's no greater investment.",
  "You are worthy of the love you give to others.",
];

export function DailyQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Get today's date as seed for consistent daily quote
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('quoteDate');
    const savedQuote = localStorage.getItem('dailyQuote');

    if (savedDate === today && savedQuote) {
      setQuote(savedQuote);
    } else {
      // Generate new quote for today
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const todaysQuote = quotes[dayOfYear % quotes.length];
      setQuote(todaysQuote);
      localStorage.setItem('quoteDate', today);
      localStorage.setItem('dailyQuote', todaysQuote);
    }
  }, []);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-3">
        <Quote className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="mb-2 text-blue-900 dark:text-blue-100">Daily Inspiration</h3>
          <p className="text-blue-800 dark:text-blue-200 italic leading-relaxed">
            {quote}
          </p>
        </div>
      </div>
    </Card>
  );
}