import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { JournalEntry } from './components/JournalEntry';
import { MoodCheckIn } from './components/MoodCheckIn';
import { MoodTrends } from './components/MoodTrends';
import { BreathingExercise } from './components/BreathingExercise';
import { StreakTracker } from './components/StreakTracker';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ErrorBoundary>
            <Dashboard setActiveTab={setActiveTab} />
          </ErrorBoundary>
        );
      case 'journal':
        return (
          <ErrorBoundary>
            <JournalEntry />
          </ErrorBoundary>
        );
      case 'mood':
        return (
          <div className="space-y-6">
            <ErrorBoundary>
              <MoodCheckIn />
            </ErrorBoundary>
            <ErrorBoundary>
              <MoodTrends />
            </ErrorBoundary>
          </div>
        );
      case 'breathe':
        return (
          <ErrorBoundary>
            <BreathingExercise />
          </ErrorBoundary>
        );
      case 'progress':
        return (
          <ErrorBoundary>
            <StreakTracker />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <Dashboard setActiveTab={setActiveTab} />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pb-20">
        <main className="p-4">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
      <ErrorBoundary>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </ErrorBoundary>
    </div>
  );
}