import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PenTool, Save, Calendar, Trash2 } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  prompt?: string;
  createdAt: number;
}

const reflectionPrompts = [
  "If you saw someone feeling the way you are feeling right now, what would you tell that person?",
  "If you wrote a book about youur first heartbreak, what would the last sentence be?",
  "If you ever had to walk into a room full of everyone you loved, who would you look for first?",
  "What's the best memory you have of your father and/or mother?",
  "Who is the persoon you lost and would like to hug again, even if only for a moment?",
  "If you ever had to walk into a room full of everyone you loved, who would you look for first?",
  "If someone offered you a box containing everything you've ever lost, what would you look for firs?",
  "You are alone, and you have one last phone call before you die... Who would you call for a final goodbye?",
  "Are you okay?",
  "If you could send a note to your younger self, what would it say?",
];

export function JournalEntry() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    setEntries(savedEntries.sort((a: JournalEntry, b: JournalEntry) => b.createdAt - a.createdAt));
  }, []);

  const getRandomPrompt = () => {
    const randomPrompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
    setCurrentPrompt(randomPrompt);
    setShowPrompts(false);
  };

  const saveEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: editingId || Date.now().toString(),
      date: new Date().toDateString(),
      content: currentEntry.trim(),
      prompt: currentPrompt || undefined,
      createdAt: editingId ? entries.find(e => e.id === editingId)?.createdAt || Date.now() : Date.now(),
    };

    let updatedEntries;
    if (editingId) {
      updatedEntries = entries.map(entry => entry.id === editingId ? newEntry : entry);
    } else {
      updatedEntries = [newEntry, ...entries];
    }

    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    setCurrentEntry('');
    setCurrentPrompt('');
    setEditingId(null);
  };

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry.content);
    setCurrentPrompt(entry.prompt || '');
    setEditingId(entry.id);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const cancelEdit = () => {
    setCurrentEntry('');
    setCurrentPrompt('');
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Journal Entry</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrompts(!showPrompts)}
            >
              Need inspiration?
            </Button>
          </div>
        </div>

        {showPrompts && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h4 className="mb-3">Reflection Prompts</h4>
            <div className="grid gap-2">
              {reflectionPrompts.slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPrompt(prompt);
                    setShowPrompts(false);
                  }}
                  className="text-left p-2 rounded hover:bg-accent transition-colors"
                >
                  {prompt}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={getRandomPrompt} className="mt-2">
                Get Random Prompt
              </Button>
            </div>
          </div>
        )}

        {currentPrompt && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Prompt:</strong> {currentPrompt}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Write about your day, thoughts, feelings, or anything on your mind..."
            className="w-full h-40 p-4 border border-border rounded-lg bg-input-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <div className="flex gap-2">
            <Button onClick={saveEntry} disabled={!currentEntry.trim()}>
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update Entry' : 'Save Entry'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3>Previous Entries</h3>
        {entries.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No journal entries yet. Start writing to begin your journey!</p>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => editEntry(entry)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {entry.prompt && (
                <Badge variant="secondary" className="mb-3">
                  Prompt: {entry.prompt}
                </Badge>
              )}
              
              <p className="whitespace-pre-wrap leading-relaxed">{entry.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}