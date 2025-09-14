import { Home, BookOpen, Heart, Activity, Target, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'breathe', label: 'Breathe', icon: Activity },
    { id: 'progress', label: 'Progress', icon: Target },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === id
                ? 'text-primary bg-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}