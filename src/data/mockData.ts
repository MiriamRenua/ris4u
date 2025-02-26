import { TableEntry } from '../types/types';

const ortsteile = ['Amern', 'Waldniel', 'Schwalmtal'];
const mockTitles = [
    'Straßensanierung',
    'Spielplatzmodernisierung',
    'Bauvorhaben',
    'Verkehrsplanung',
    'Umweltschutzmaßnahmen'
];

function generateMockData(): TableEntry[] {
    const data: TableEntry[] = [];
    
    ortsteile.forEach(ortsteil => {
        for (let i = 1; i <= 25; i++) {
            const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const formattedDate = [
                date.getDate().toString().padStart(2, '0'),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getFullYear()
            ].join('.');
            
            const entry: TableEntry = {
                vorgangsnummer: `${ortsteil.substring(0, 2)}-${2023}-${i.toString().padStart(3, '0')}`,
                datum: formattedDate,
                titel: mockTitles[Math.floor(Math.random() * mockTitles.length)],
                dokumente: [`Dokument_${i}_1.pdf`, `Dokument_${i}_2.pdf`],
                zusammenfassung: `Zusammenfassung für Vorgang ${i} in ${ortsteil}`,
                ortsteil: ortsteil
            };
            data.push(entry);
        }
    });
    
    return data;
}

export const mockData = generateMockData();
