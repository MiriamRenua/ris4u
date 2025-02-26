export type TableEntry = {
  vorgangsnummer: string;
  datum: string;
  titel: string;
  dokumente: string[];
  zusammenfassung: string;
  ortsteil: string;
}

export type SortDirection = 'asc' | 'desc';
export type SortKey = keyof Pick<TableEntry, 'vorgangsnummer' | 'datum' | 'titel'>;