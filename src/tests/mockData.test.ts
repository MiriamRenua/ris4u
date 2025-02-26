import { describe, it, expect } from 'vitest';
import { mockData } from '../data/mockData';

describe('mockData', () => {
  it('should generate correct number of entries', () => {
    expect(mockData.length).toBe(75); // 25 entries * 3 Ortsteile
  });

  it('should have correct data structure', () => {
    const entry = mockData[0];
    expect(entry).toHaveProperty('vorgangsnummer');
    expect(entry).toHaveProperty('datum');
    expect(entry).toHaveProperty('titel');
    expect(entry).toHaveProperty('dokumente');
    expect(entry).toHaveProperty('zusammenfassung');
    expect(entry).toHaveProperty('ortsteil');
  });

  it('should have correct Ortsteile distribution', () => {
    const amernEntries = mockData.filter(e => e.ortsteil === 'Amern');
    const waldnielEntries = mockData.filter(e => e.ortsteil === 'Waldniel');
    const schwalmtalEntries = mockData.filter(e => e.ortsteil === 'Schwalmtal');

    expect(amernEntries.length).toBe(25);
    expect(waldnielEntries.length).toBe(25);
    expect(schwalmtalEntries.length).toBe(25);
  });
});
