import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Perfume, PerfumeService } from './perfume.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="min-h-screen bg-stone-50 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div class="flex items-center gap-4">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 text-white shrink-0">
              <mat-icon>compare_arrows</mat-icon>
            </div>
            <div>
              <h1 class="text-3xl font-serif font-medium tracking-tight text-stone-900 mb-1">Compare Perfumes</h1>
              <p class="text-stone-500">Select two perfumes to see how they compare side-by-side.</p>
            </div>
          </div>
          <button 
            routerLink="/explore"
            class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors flex items-center gap-2">
            <mat-icon>arrow_back</mat-icon>
            Back to Explore
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <!-- Perfume 1 Selection -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <label for="perfume1" class="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">First Perfume</label>
            <select 
              id="perfume1"
              class="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all"
              (change)="onSelect1($event)">
              <option value="">-- Select First Perfume --</option>
              @for (p of allPerfumes(); track p['Perfume Name']) {
                <option [value]="getSlug(p)">{{ p.Brand }} - {{ p['Perfume Name'] }}</option>
              }
            </select>
          </div>

          <!-- Perfume 2 Selection -->
          <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <label for="perfume2" class="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Second Perfume</label>
            <select 
              id="perfume2"
              class="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all"
              (change)="onSelect2($event)">
              <option value="">-- Select Second Perfume --</option>
              @for (p of allPerfumes(); track p['Perfume Name']) {
                <option [value]="getSlug(p)">{{ p.Brand }} - {{ p['Perfume Name'] }}</option>
              }
            </select>
          </div>
        </div>

        @if (perfume1() && perfume2()) {
          <div class="flex justify-center mb-8">
            <button 
              [routerLink]="['/mix-it']"
              [queryParams]="{ p1: getSlug(perfume1()!), p2: getSlug(perfume2()!) }"
              class="px-8 py-4 rounded-full bg-amber-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3 active:scale-95">
              <mat-icon>science</mat-icon>
              Mix these perfumes
            </button>
          </div>
        }

        @if (perfume1() || perfume2()) {
          <div class="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr class="bg-stone-900 text-white">
                    <th class="p-6 border-b border-stone-800 font-medium text-stone-400 w-1/4">Feature</th>
                    <th class="p-6 border-b border-stone-800 w-3/8">
                      @if (perfume1()) {
                        <div class="font-serif text-2xl mb-1">{{ perfume1()?.['Perfume Name'] }}</div>
                        <div class="text-xs uppercase tracking-widest text-stone-400">{{ perfume1()?.Brand }}</div>
                      } @else {
                        <span class="text-stone-600 italic">Select a perfume</span>
                      }
                    </th>
                    <th class="p-6 border-b border-stone-800 w-3/8">
                      @if (perfume2()) {
                        <div class="font-serif text-2xl mb-1">{{ perfume2()?.['Perfume Name'] }}</div>
                        <div class="text-xs uppercase tracking-widest text-stone-400">{{ perfume2()?.Brand }}</div>
                      } @else {
                        <span class="text-stone-600 italic">Select a perfume</span>
                      }
                    </th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Gender</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume1()?.Gender || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume2()?.Gender || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Olfactory Family</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume1()?.['Olfactory Family'] || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume2()?.['Olfactory Family'] || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Key Notes</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800 leading-relaxed">{{ perfume1()?.['Key Notes'] || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800 leading-relaxed">{{ perfume2()?.['Key Notes'] || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Longevity</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume1()?.Longevity || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume2()?.Longevity || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Sillage</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume1()?.Sillage || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume2()?.Sillage || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">When to Wear</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume1()?.['When to Wear'] || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume2()?.['When to Wear'] || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Best Occasion</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume1()?.['Best Occasion'] || '-' }}</td>
                    <td class="p-6 border-b border-stone-100 text-stone-800">{{ perfume2()?.['Best Occasion'] || '-' }}</td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-colors">
                    <td class="p-6 border-b border-stone-100 font-bold uppercase tracking-wider text-[10px] text-stone-400">Impression Price</td>
                    <td class="p-6 border-b border-stone-100">
                      @if (perfume1()) {
                        <span class="text-xl font-medium text-stone-900">{{ getImpressionPrice(perfume1()!['Price (AED)']) }} AED</span>
                      } @else { - }
                    </td>
                    <td class="p-6 border-b border-stone-100">
                      @if (perfume2()) {
                        <span class="text-xl font-medium text-stone-900">{{ getImpressionPrice(perfume2()!['Price (AED)']) }} AED</span>
                      } @else { - }
                    </td>
                  </tr>
                  <tr>
                    <td class="p-6 font-bold uppercase tracking-wider text-[10px] text-stone-400">Action</td>
                    <td class="p-6">
                      @if (perfume1()) {
                        <button 
                          (click)="buyOnWhatsApp(perfume1()!)"
                          class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full">
                          <mat-icon>chat</mat-icon>
                          Buy Now
                        </button>
                      }
                    </td>
                    <td class="p-6">
                      @if (perfume2()) {
                        <button 
                          (click)="buyOnWhatsApp(perfume2()!)"
                          class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full">
                          <mat-icon>chat</mat-icon>
                          Buy Now
                        </button>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        } @else {
          <div class="bg-white rounded-3xl border-2 border-dashed border-stone-200 p-20 text-center">
            <mat-icon class="text-6xl text-stone-200 mb-4">compare_arrows</mat-icon>
            <h2 class="text-xl font-serif text-stone-400">Select perfumes above to start comparing</h2>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CompareComponent {
  private perfumeService = inject(PerfumeService);
  
  allPerfumes = this.perfumeService.perfumes;
  
  perfume1 = signal<Perfume | undefined>(undefined);
  perfume2 = signal<Perfume | undefined>(undefined);

  onSelect1(event: Event) {
    const slug = (event.target as HTMLSelectElement).value;
    this.perfume1.set(slug ? this.perfumeService.getPerfumeBySlug(slug) : undefined);
  }

  onSelect2(event: Event) {
    const slug = (event.target as HTMLSelectElement).value;
    this.perfume2.set(slug ? this.perfumeService.getPerfumeBySlug(slug) : undefined);
  }

  getSlug(perfume: Perfume): string {
    return this.perfumeService.getSlug(perfume);
  }

  getImpressionPrice(priceStr: string): number {
    return this.perfumeService.getImpressionPrice(priceStr);
  }

  buyOnWhatsApp(perfume: Perfume) {
    const price = this.getImpressionPrice(perfume['Price (AED)']);
    const message = `Hi X Perfumes! I want to buy the impression of ${perfume['Perfume Name']} by ${perfume.Brand} for ${price} AED.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971585328790?text=${encodedMessage}`, '_blank');
  }
}
