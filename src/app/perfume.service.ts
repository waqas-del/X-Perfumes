import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Perfume {
  'Perfume Name': string;
  'Brand': string;
  'Gender': string;
  'Olfactory Family': string;
  'Key Notes': string;
  'When to Wear': string;
  'Best Occasion': string;
  'Longevity': string;
  'Sillage': string;
  'Year': string;
  'Perfumer(s)': string;
  '1 Pro': string;
  '1 Con': string;
  'The Perfect Persona': string;
  'Price (AED)': string;
}

export interface QuizAnswers {
  gender: string;
  profession: string;
  occasion: string;
  type: string;
  season: string;
  persona: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
  private http = inject(HttpClient);
  private csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQebZrIOwelNa9ALpM83N50gjelGwa1PJe0Zq9Ni8lgR9h5qOMQok7AZ2WabmPoaitcvoC8OVkLXtpy/pub?output=csv';

  perfumes = signal<Perfume[]>([]);
  isLoaded = signal<boolean>(false);
  private loadPromise: Promise<void>;

  constructor() {
    this.loadPromise = this.loadPerfumes();
  }

  async ensureLoaded() {
    return this.loadPromise;
  }

  async loadPerfumes() {
    try {
      const csvData = await firstValueFrom(this.http.get(this.csvUrl, { responseType: 'text' }));
      const parsed = this.parseCSV(csvData);
      this.perfumes.set(parsed);
      this.isLoaded.set(true);
    } catch (error) {
      console.error('Error loading perfumes from Google Sheets:', error);
      // Fallback or handle error
    }
  }

  private parseCSV(csv: string): Perfume[] {
    const lines = csv.split(/\r?\n/);
    if (lines.length === 0) return [];

    const headers = this.parseCSVLine(lines[0]);
    const perfumes: Perfume[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = this.parseCSVLine(lines[i]);
      const perfume: Record<string, string> = {};
      headers.forEach((header, index) => {
        const key = header.trim().replace(/^"|"$/g, '');
        const val = values[index]?.trim().replace(/^"|"$/g, '') || '';
        perfume[key] = val;
      });
      perfumes.push(perfume as unknown as Perfume);
    }
    return perfumes;
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  getSlug(perfume: Perfume): string {
    const base = `${perfume.Brand} ${perfume['Perfume Name']}`;
    return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  getPerfumeBySlug(slug: string): Perfume | undefined {
    return this.perfumes().find(p => this.getSlug(p) === slug);
  }

  getImpressionPrice(originalPriceStr: string): number {
    const price = parseFloat(originalPriceStr.replace(/,/g, ''));
    if (isNaN(price)) return 60;
    if (price > 1500) return 99;
    if (price > 1000) return 89;
    if (price > 750) return 79;
    if (price > 500) return 69;
    return 60;
  }

  getRecommendations(answers: QuizAnswers): Perfume[] {
    const scoredPerfumes = this.perfumes().map(perfume => {
      let score = 0;

      // 1. Gender
      const pGender = (perfume.Gender || '').toLowerCase();
      const aGender = (answers.gender || '').toLowerCase();
      if (aGender === 'him' && (pGender === 'male' || pGender === 'unisex')) score += 10;
      else if (aGender === 'her' && (pGender === 'female' || pGender === 'unisex')) score += 10;
      else if (aGender === 'unisex' && pGender === 'unisex') score += 10;
      else if (aGender === 'unisex') score += 5;

      // 2. Profession (map to persona/occasion keywords)
      const persona = (perfume['The Perfect Persona'] || '').toLowerCase();
      const occasion = (perfume['Best Occasion'] || '').toLowerCase();
      const prof = answers.profession;
      if (prof === 'Corporate / Office' && (persona.includes('professional') || persona.includes('leader') || persona.includes('executive') || occasion.includes('office') || occasion.includes('business'))) score += 5;
      if (prof === 'Creative / Artistic' && (persona.includes('artistic') || persona.includes('creative') || persona.includes('unique'))) score += 5;
      if (prof === 'Student / Casual' && (persona.includes('youthful') || persona.includes('casual') || persona.includes('playful') || occasion.includes('casual') || occasion.includes('school'))) score += 5;
      if (prof === 'Entrepreneur / Leader' && (persona.includes('ambitious') || persona.includes('leader') || persona.includes('wealthy') || persona.includes('boss'))) score += 5;
      if (prof === 'Healthcare / Service' && (persona.includes('clean') || persona.includes('comforting') || persona.includes('reliable'))) score += 5;

      // 3. Occasion
      const occ = answers.occasion;
      if (occ === 'Daily Wear / Office' && (occasion.includes('office') || occasion.includes('daily') || occasion.includes('casual') || occasion.includes('any'))) score += 5;
      if (occ === 'Date Night / Romance' && (occasion.includes('date') || occasion.includes('romance') || occasion.includes('intimate'))) score += 5;
      if (occ === 'Clubbing / Parties' && (occasion.includes('clubbing') || occasion.includes('party') || occasion.includes('night out'))) score += 5;
      if (occ === 'Formal Events / Weddings' && (occasion.includes('formal') || occasion.includes('wedding') || occasion.includes('black tie'))) score += 5;
      if (occ === 'Casual / Weekends' && (occasion.includes('casual') || occasion.includes('weekend') || occasion.includes('gym'))) score += 5;

      // 4. Type
      const family = (perfume['Olfactory Family'] || '').toLowerCase();
      const notes = (perfume['Key Notes'] || '').toLowerCase();
      const type = answers.type;
      if (type === 'Fresh / Citrus / Aquatic' && (family.includes('fresh') || family.includes('citrus') || family.includes('aquatic') || notes.includes('lemon') || notes.includes('bergamot') || notes.includes('sea'))) score += 5;
      if (type === 'Woody / Spicy' && (family.includes('woody') || family.includes('spicy') || notes.includes('cedar') || notes.includes('vetiver') || notes.includes('pepper') || notes.includes('cardamom'))) score += 5;
      if (type === 'Floral / Fruity' && (family.includes('floral') || family.includes('fruity') || notes.includes('rose') || notes.includes('jasmine') || notes.includes('apple') || notes.includes('pineapple'))) score += 5;
      if (type === 'Sweet / Gourmand / Vanilla' && (family.includes('gourmand') || family.includes('vanilla') || family.includes('sweet') || notes.includes('vanilla') || notes.includes('tonka') || notes.includes('caramel'))) score += 5;
      if (type === 'Leather / Oud / Smoky' && (family.includes('leather') || family.includes('oud') || family.includes('smoky') || notes.includes('leather') || notes.includes('oud') || notes.includes('incense') || notes.includes('tobacco'))) score += 5;

      // 5. Season
      const wear = (perfume['When to Wear'] || '').toLowerCase();
      const season = answers.season;
      if (season === 'Summer / Spring' && (wear.includes('summer') || wear.includes('spring') || wear.includes('all seasons'))) score += 5;
      if (season === 'Winter / Autumn' && (wear.includes('winter') || wear.includes('autumn') || wear.includes('fall') || wear.includes('all seasons'))) score += 5;
      if (season === 'All Seasons' && wear.includes('all seasons')) score += 5;

      // 6. Persona
      const pers = answers.persona;
      if (pers === 'Confident & Ambitious' && (persona.includes('confident') || persona.includes('ambitious') || persona.includes('commanding'))) score += 5;
      if (pers === 'Elegant & Sophisticated' && (persona.includes('elegant') || persona.includes('sophisticated') || persona.includes('classy') || persona.includes('gentleman') || persona.includes('lady'))) score += 5;
      if (pers === 'Playful & Energetic' && (persona.includes('playful') || persona.includes('energetic') || persona.includes('fun'))) score += 5;
      if (pers === 'Mysterious & Seductive' && (persona.includes('mysterious') || persona.includes('seductive') || persona.includes('dark') || persona.includes('magnetic'))) score += 5;
      if (pers === 'Calm & Grounded' && (persona.includes('calm') || persona.includes('grounded') || persona.includes('mature') || persona.includes('relaxed'))) score += 5;

      return { perfume, score };
    });

    scoredPerfumes.sort((a, b) => b.score - a.score);
    return scoredPerfumes.slice(0, 3).map(sp => sp.perfume);
  }
}
