// ─── Prism Storage Service ──────────────────────────────────────────
// All persistence uses localStorage. No backend required.
// Keys: prism_moods, prism_journals, prism_breathing

export interface MoodEntry {
  x: number;
  y: number;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

export interface JournalEntry {
  text: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

export interface BreathingSession {
  inhale: number;
  hold: number;
  exhale: number;
  durationSeconds: number;
  cycles: number;
  timestamp: number;
}

const KEYS = {
  moods: "prism_moods",
  journals: "prism_journals",
  breathing: "prism_breathing",
} as const;

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Mood ───────────────────────────────────────────────────────────

export function saveMood(x: number, y: number): MoodEntry {
  const moods = read<MoodEntry>(KEYS.moods);
  const dateStr = today();
  // Replace today's entry if it exists
  const idx = moods.findIndex((m) => m.date === dateStr);
  const entry: MoodEntry = { x, y, timestamp: Date.now(), date: dateStr };
  if (idx >= 0) {
    moods[idx] = entry;
  } else {
    moods.push(entry);
  }
  write(KEYS.moods, moods);
  return entry;
}

export function getMoods(): MoodEntry[] {
  return read<MoodEntry>(KEYS.moods);
}

export function getTodayMood(): MoodEntry | null {
  const moods = read<MoodEntry>(KEYS.moods);
  const dateStr = today();
  return moods.find((m) => m.date === dateStr) || null;
}

export function getLatestMood(): MoodEntry | null {
  const moods = read<MoodEntry>(KEYS.moods);
  if (moods.length === 0) return null;
  return moods[moods.length - 1];
}

export function getWeekMoods(): MoodEntry[] {
  const moods = read<MoodEntry>(KEYS.moods);
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Get moods from last 7 days, one per day (latest wins)
  const dayMap = new Map<string, MoodEntry>();
  for (const m of moods) {
    const mDate = new Date(m.timestamp);
    if (mDate >= sevenDaysAgo) {
      dayMap.set(m.date, m);
    }
  }

  // Return sorted by date
  return Array.from(dayMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getRecentMoods(count: number = 5): MoodEntry[] {
  const moods = read<MoodEntry>(KEYS.moods);
  return moods.slice(-count).reverse();
}

// ─── Journal ────────────────────────────────────────────────────────

export function saveJournal(text: string): JournalEntry {
  const journals = read<JournalEntry>(KEYS.journals);
  const dateStr = today();
  // Replace today's entry if it exists
  const idx = journals.findIndex((j) => j.date === dateStr);
  const entry: JournalEntry = { text, timestamp: Date.now(), date: dateStr };
  if (idx >= 0) {
    journals[idx] = entry;
  } else {
    journals.push(entry);
  }
  write(KEYS.journals, journals);
  return entry;
}

export function getJournals(): JournalEntry[] {
  return read<JournalEntry>(KEYS.journals);
}

export function getTodayJournal(): JournalEntry | null {
  const journals = read<JournalEntry>(KEYS.journals);
  const dateStr = today();
  return journals.find((j) => j.date === dateStr) || null;
}

export function getRecentJournals(count: number = 7): JournalEntry[] {
  const journals = read<JournalEntry>(KEYS.journals);
  return journals.slice(-count).reverse();
}

// ─── Breathing ──────────────────────────────────────────────────────

export function saveBreathingSession(
  inhale: number,
  hold: number,
  exhale: number,
  durationSeconds: number,
  cycles: number
): BreathingSession {
  const sessions = read<BreathingSession>(KEYS.breathing);
  const entry: BreathingSession = {
    inhale,
    hold,
    exhale,
    durationSeconds,
    cycles,
    timestamp: Date.now(),
  };
  sessions.push(entry);
  write(KEYS.breathing, sessions);
  return entry;
}

export function getBreathingSessions(): BreathingSession[] {
  return read<BreathingSession>(KEYS.breathing);
}

export function getTotalBreathingMinutes(): number {
  const sessions = read<BreathingSession>(KEYS.breathing);
  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  return Math.round(totalSeconds / 60);
}

export function getTotalBreathingSessions(): number {
  return read<BreathingSession>(KEYS.breathing).length;
}

// ─── Streak ─────────────────────────────────────────────────────────

export function getStreak(): number {
  const moods = read<MoodEntry>(KEYS.moods);
  const journals = read<JournalEntry>(KEYS.journals);

  // Collect all unique dates where user did something
  const activeDays = new Set<string>();
  for (const m of moods) activeDays.add(m.date);
  for (const j of journals) activeDays.add(j.date);

  if (activeDays.size === 0) return 0;

  // Count consecutive days going backwards from today
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  while (true) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (activeDays.has(dateStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// ─── Helpers ────────────────────────────────────────────────────────

export function getMoodQuadrant(x: number, y: number): { label: string; emoji: string } {
  if (x >= 0 && y >= 0) return { label: "Happy & Excited", emoji: "🤩" };
  if (x < 0 && y >= 0) return { label: "Stressed", emoji: "😤" };
  if (x >= 0 && y < 0) return { label: "Content", emoji: "😊" };
  return { label: "Tired", emoji: "😴" };
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

export function getShortDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
}

export function getTotalMoodsLogged(): number {
  return read<MoodEntry>(KEYS.moods).length;
}
