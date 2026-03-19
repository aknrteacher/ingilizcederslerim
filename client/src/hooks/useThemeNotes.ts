import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'admin_theme_notes';

function getAllNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function getThemeNote(key: string): string {
  const notes = getAllNotes();
  return notes[key] ?? '';
}

export function setThemeNote(key: string, value: string): void {
  const notes = getAllNotes();
  if (value.trim()) {
    notes[key] = value;
  } else {
    delete notes[key];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useThemeNotes(key: string): [string, (value: string) => void] {
  const [note, setNote] = useState<string>(() => getThemeNote(key));

  useEffect(() => {
    setNote(getThemeNote(key));
  }, [key]);

  const saveNote = useCallback(
    (value: string) => {
      setNote(value);
      setThemeNote(key, value);
    },
    [key]
  );

  return [note, saveNote];
}
