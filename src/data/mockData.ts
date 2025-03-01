import { TableEntry } from '../types/types';

const ortsteile = ['Amern', 'Waldniel', 'Schwalmtal'];
const mockTitles = [
    'Straßensanierung',
    'Spielplatzmodernisierung',
    'Bauvorhaben',
    'Verkehrsplanung',
    'Umweltschutzmaßnahmen'
];

const mockZusammenfassungen = [
    'Die geplante Maßnahme umfasst eine umfangreiche Sanierung der bestehenden Infrastruktur im bezeichneten Gebiet. Der Fokus liegt dabei auf der nachhaltigen Verbesserung der Lebensqualität für die Anwohner sowie der Optimierung der Verkehrssicherheit. Im Rahmen der Arbeiten werden nicht nur die Straßenbeläge erneuert, sondern auch die darunter liegenden Versorgungsleitungen auf den neuesten Stand gebracht.\n\nDie Umsetzung erfolgt in mehreren Phasen, um die Beeinträchtigungen für die Anwohner so gering wie möglich zu halten. Besondere Aufmerksamkeit wird auf die Barrierefreiheit und die Integration von umweltfreundlichen Materialien gelegt. Die geschätzten Kosten belaufen sich auf 2,5 Millionen Euro, wobei Fördergelder vom Land beantragt wurden.',
    'Im Zuge der Modernisierung der kommunalen Einrichtungen wird eine vollständige Neugestaltung des lokalen Erholungsgebiets angestrebt. Der Schwerpunkt liegt auf der Schaffung eines generationenübergreifenden Begegnungsorts mit innovativen Spiel- und Sportmöglichkeiten. Die Planungen sehen vor, dass sowohl traditionelle Spielgeräte als auch moderne Fitness-Elemente integriert werden.\n\nBesonders hervorzuheben ist das nachhaltige Konzept, das auf regenerative Energien und wasserdurchlässige Bodenbeläge setzt. Die Bürger wurden in mehreren Workshops aktiv in die Planungsphase einbezogen, wodurch viele kreative Ideen in das Projekt eingeflossen sind.',
    'Das vorliegende Bauvorhaben sieht die Errichtung eines multifunktionalen Gebäudekomplexes vor, der sowohl Wohn- als auch Geschäftsräume beherbergen wird. Die architektonische Gestaltung wurde unter Berücksichtigung der historischen Bausubstanz der Umgebung entwickelt und fügt sich harmonisch in das Stadtbild ein.\n\nBesonderes Augenmerk wurde auf energieeffiziente Bauweise und die Integration erneuerbarer Energien gelegt. Die Dachflächen werden extensiv begrünt und mit Photovoltaikanlagen ausgestattet. Im Erdgeschoss sind Einzelhandelsflächen vorgesehen, während in den oberen Etagen barrierefreie Wohnungen entstehen.',
    'Die neue Verkehrsführung zielt darauf ab, den Durchgangsverkehr zu reduzieren und gleichzeitig die Sicherheit für Fußgänger und Radfahrer zu erhöhen. Ein innovatives Konzept für shared spaces wird in ausgewählten Bereichen umgesetzt, um eine gleichberechtigte Nutzung des Straßenraums zu ermöglichen.\n\nDie Maßnahmen umfassen die Installation intelligenter Ampelsysteme, die Einrichtung von Fahrradstreifen und die Optimierung des ÖPNV-Angebots. Ergänzend werden Tempo-30-Zonen ausgeweitet und neue Querungshilfen für Fußgänger geschaffen.',
    'Das Umweltschutzprogramm beinhaltet eine Reihe von Maßnahmen zur Verbesserung der lokalen Ökobilanz. Zentrale Elemente sind die Renaturierung von Bachläufen, die Anlage von Blühstreifen und die Schaffung von Biotopverbundsystemen. Diese Maßnahmen dienen dem Erhalt der Artenvielfalt und der Stärkung des natürlichen Gleichgewichts.\n\nParallel dazu werden Initiativen zur Reduzierung des CO2-Ausstoßes gestartet, darunter die Förderung von E-Mobilität und die energetische Sanierung öffentlicher Gebäude. Ein begleitendes Bildungsprogramm sensibilisiert Bürger für Umweltthemen.'
];

function generateMockData(): TableEntry[] {
    const data: TableEntry[] = [];
    
    // Generate document arrays
    const beschluesse = Array.from({ length: 5 }, (_, i) => 
        `Beschluss_${(i + 1).toString().padStart(2, '0')}`
    );
    const anlagen = Array.from({ length: 5 }, (_, i) => 
        `Anlage_${(i + 1).toString().padStart(2, '0')}`
    );
    
    ortsteile.forEach(ortsteil => {
        for (let i = 1; i <= 25; i++) {
            const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const formattedDate = [
                date.getDate().toString().padStart(2, '0'),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getFullYear()
            ].join('.');
            
            const titleIndex = Math.floor(Math.random() * mockTitles.length);
            
            // Select exactly one random Beschluss
            const selectedBeschluss = beschluesse[Math.floor(Math.random() * beschluesse.length)];
            
            // Select 1-3 random Anlagen
            const selectedAnlagen = anlagen
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.floor(Math.random() * 3) + 1);
            
            const entry: TableEntry = {
                vorgangsnummer: `${ortsteil.substring(0, 2)}-${2023}-${i.toString().padStart(3, '0')}`,
                datum: formattedDate,
                titel: mockTitles[titleIndex],
                dokumente: [selectedBeschluss, ...selectedAnlagen],
                zusammenfassung: mockZusammenfassungen[titleIndex],
                ortsteil: ortsteil
            };
            data.push(entry);
        }
    });
    
    return data;
}

export const mockData = generateMockData();
