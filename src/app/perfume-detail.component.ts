import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Perfume, PerfumeService } from './perfume.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-perfume-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="min-h-screen bg-stone-50 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        @if (perfume()) {
          <button routerLink="/explore" class="mb-8 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors flex items-center gap-2 w-fit">
            <mat-icon>arrow_back</mat-icon>
            Back to Explore
          </button>

          <div class="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            <div class="p-8 sm:p-12 border-b border-stone-100 bg-stone-900 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <mat-icon style="font-size: 300px; width: 300px; height: 300px;">water_drop</mat-icon>
              </div>
              <div class="relative z-10">
                <p class="text-sm font-medium uppercase tracking-widest text-stone-400 mb-2">{{ perfume()?.Brand }}</p>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight mb-4">{{ perfume()?.['Perfume Name'] }}</h1>
                <div class="flex flex-wrap gap-3 mb-8">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm">
                    {{ perfume()?.Gender }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm">
                    {{ perfume()?.['Olfactory Family'] }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm">
                    Released: {{ perfume()?.Year }}
                  </span>
                </div>
                
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white/5 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                  <div>
                    <p class="text-sm text-stone-400 line-through mb-1">Original Price: {{ perfume()?.['Price (AED)'] }} AED</p>
                    <p class="text-3xl font-medium text-white">Impression: {{ impressionPrice() }} AED</p>
                  </div>
                  <button 
                    (click)="buyOnWhatsApp()"
                    class="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-stone-900 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20">
                    <mat-icon>chat</mat-icon>
                    Buy via WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div class="p-8 sm:p-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="space-y-8">
                  <section>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                      <mat-icon class="text-[18px] w-[18px] h-[18px]">auto_awesome</mat-icon>
                      Scent Profile
                    </h2>
                    <p class="text-lg text-stone-800 leading-relaxed">{{ perfume()?.['Key Notes'] }}</p>
                  </section>

                  <section>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                      <mat-icon class="text-[18px] w-[18px] h-[18px]">person</mat-icon>
                      The Perfect Persona
                    </h2>
                    <p class="text-xl font-serif italic text-stone-700">"{{ perfume()?.['The Perfect Persona'] }}"</p>
                  </section>
                  
                  <section>
                    <h2 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                      <mat-icon class="text-[18px] w-[18px] h-[18px]">science</mat-icon>
                      Perfumer(s)
                    </h2>
                    <p class="text-stone-800">{{ perfume()?.['Perfumer(s)'] }}</p>
                  </section>
                </div>

                <div class="space-y-8">
                  <section class="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    <h2 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Performance & Wear</h2>
                    <ul class="space-y-4">
                      <li class="flex justify-between items-center border-b border-stone-200 pb-2">
                        <span class="text-stone-500">Longevity</span>
                        <span class="font-medium text-stone-900">{{ perfume()?.Longevity }}</span>
                      </li>
                      <li class="flex justify-between items-center border-b border-stone-200 pb-2">
                        <span class="text-stone-500">Sillage</span>
                        <span class="font-medium text-stone-900">{{ perfume()?.Sillage }}</span>
                      </li>
                      <li class="flex justify-between items-center border-b border-stone-200 pb-2">
                        <span class="text-stone-500">Season</span>
                        <span class="font-medium text-stone-900">{{ perfume()?.['When to Wear'] }}</span>
                      </li>
                      <li class="flex justify-between items-center pb-2">
                        <span class="text-stone-500">Best Occasion</span>
                        <span class="font-medium text-stone-900 text-right max-w-[60%]">{{ perfume()?.['Best Occasion'] }}</span>
                      </li>
                    </ul>
                  </section>

                  <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="bg-green-50 p-4 rounded-2xl border border-green-100">
                      <h3 class="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[16px] w-[16px] h-[16px]">add_circle</mat-icon> Pro
                      </h3>
                      <p class="text-sm text-green-900">{{ perfume()?.['1 Pro'] }}</p>
                    </div>
                    <div class="bg-red-50 p-4 rounded-2xl border border-red-100">
                      <h3 class="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 flex items-center gap-1">
                        <mat-icon class="text-[16px] w-[16px] h-[16px]">remove_circle</mat-icon> Con
                      </h3>
                      <p class="text-sm text-red-900">{{ perfume()?.['1 Con'] }}</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>

          <!-- Comparison Section -->
          <div class="mt-12 bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden p-8 sm:p-12">
            <h2 class="text-2xl font-serif font-medium mb-6 flex items-center gap-2">
              <mat-icon>compare_arrows</mat-icon>
              Compare Perfumes
            </h2>
            <div class="mb-8 flex flex-col sm:flex-row items-end gap-4">
              <div class="flex-grow w-full">
                <label for="compare-select" class="block text-sm font-medium text-stone-700 mb-2">Select a perfume to compare with {{ perfume()?.['Perfume Name'] }}</label>
                <select 
                  id="compare-select"
                  class="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all"
                  (change)="onCompareSelect($event)">
                  <option value="">-- Select a Perfume --</option>
                  @for (p of allPerfumes(); track p['Perfume Name']) {
                    @if (p['Perfume Name'] !== perfume()?.['Perfume Name']) {
                      <option [value]="getSlug(p)">{{ p.Brand }} - {{ p['Perfume Name'] }}</option>
                    }
                  }
                </select>
              </div>
              @if (comparePerfume()) {
                <button 
                  [routerLink]="['/mix-it']"
                  [queryParams]="{ p1: getSlug(perfume()!), p2: getSlug(comparePerfume()!) }"
                  class="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-amber-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95">
                  <mat-icon>science</mat-icon>
                  Mix these two
                </button>
              }
            </div>

            @if (comparePerfume()) {
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th class="p-4 border-b border-stone-200 font-medium text-stone-500 w-1/4">Feature</th>
                      <th class="p-4 border-b border-stone-200 font-serif text-xl w-3/8 text-stone-900">{{ perfume()?.['Perfume Name'] }}</th>
                      <th class="p-4 border-b border-stone-200 font-serif text-xl w-3/8 text-stone-900">{{ comparePerfume()?.['Perfume Name'] }}</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm">
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Brand</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.Brand }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.Brand }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Gender</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.Gender }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.Gender }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Olfactory Family</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.['Olfactory Family'] }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.['Olfactory Family'] }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Key Notes</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.['Key Notes'] }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.['Key Notes'] }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Longevity</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.Longevity }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.Longevity }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Sillage</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.Sillage }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.Sillage }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Best Occasion</td>
                      <td class="p-4 border-b border-stone-100">{{ perfume()?.['Best Occasion'] }}</td>
                      <td class="p-4 border-b border-stone-100">{{ comparePerfume()?.['Best Occasion'] }}</td>
                    </tr>
                    <tr>
                      <td class="p-4 border-b border-stone-100 font-medium text-stone-700">Impression Price</td>
                      <td class="p-4 border-b border-stone-100 font-medium text-lg">{{ impressionPrice() }} AED</td>
                      <td class="p-4 border-b border-stone-100 font-medium text-lg">{{ compareImpressionPrice() }} AED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
          </div>

          <!-- Perfect Pairings Section -->
          <div class="mt-12 bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden p-8 sm:p-12">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-serif font-medium flex items-center gap-2">
                <mat-icon class="text-amber-500">auto_awesome</mat-icon>
                Perfect Pairings
              </h2>
            </div>

            <p class="text-stone-500 mb-8 max-w-2xl">Discover scents that complement {{ perfume()?.['Perfume Name'] }}. We've selected these based on complementary olfactory profiles and personas to find your perfect fragrance layering or rotation partners.</p>

            @if (pairings().length > 0) {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (pair of pairings(); track pair['Perfume Name']) {
                  <a [routerLink]="['/perfume', getSlug(pair)]" class="group bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-stone-900 hover:bg-white transition-all">
                    <p class="text-[10px] font-medium uppercase tracking-widest text-stone-400 mb-1 group-hover:text-stone-600 transition-colors">{{ pair.Brand }}</p>
                    <h3 class="text-lg font-serif font-medium text-stone-900 mb-3 group-hover:underline">{{ pair['Perfume Name'] }}</h3>
                    <div class="flex items-center gap-2 text-xs text-stone-500">
                      <mat-icon class="text-[14px] w-[14px] h-[14px]">water_drop</mat-icon>
                      {{ pair['Olfactory Family'] }}
                    </div>
                  </a>
                }
              </div>
            } @else {
              <div class="text-center py-8 text-stone-400">
                <mat-icon class="text-4xl mb-2 opacity-50">psychology</mat-icon>
                <p>No pairings suggested yet.</p>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-20">
            <mat-icon class="text-6xl text-stone-300 mb-4">search_off</mat-icon>
            <h2 class="text-2xl font-serif text-stone-900 mb-2">Perfume Not Found</h2>
            <p class="text-stone-500 mb-6">We couldn't find the perfume you're looking for.</p>
            <button routerLink="/explore" class="px-6 py-3 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-2">
              <mat-icon>arrow_back</mat-icon>
              Back to Explore
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class PerfumeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private perfumeService = inject(PerfumeService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private platformId = inject(PLATFORM_ID);
 
  perfume = signal<Perfume | undefined>(undefined);
  impressionPrice = signal<number>(0);
 
  allPerfumes = this.perfumeService.perfumes;
  isLoaded = this.perfumeService.isLoaded;
  comparePerfume = signal<Perfume | undefined>(undefined);
  compareImpressionPrice = signal<number>(0);
 
  pairings = signal<Perfume[]>([]);
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPerfumeData(slug);
      }
    });
  }

  private async loadPerfumeData(slug: string) {
    await this.perfumeService.ensureLoaded();
    const found = this.perfumeService.getPerfumeBySlug(slug);
    if (found) {
      this.perfume.set(found);
      this.impressionPrice.set(this.perfumeService.getImpressionPrice(found['Price (AED)']));
      this.updateSEO(found);
      // Reset comparison when main perfume changes
      this.comparePerfume.set(undefined);
      this.compareImpressionPrice.set(0);
      
      // Generate pairings
      this.generatePairings(found);
    }
  }
 
  generatePairings(currentPerfume: Perfume) {
    const all = this.allPerfumes();
    if (all.length === 0) return;

    const currentFamily = currentPerfume['Olfactory Family'];
    
    // Complementary families mapping
    const complementaryMap: Record<string, string[]> = {
      'Floral': ['Woody', 'Citrus', 'Spicy', 'Floral'],
      'Woody': ['Floral', 'Oriental', 'Citrus', 'Woody'],
      'Citrus': ['Floral', 'Woody', 'Fresh', 'Citrus'],
      'Oriental': ['Woody', 'Spicy', 'Floral', 'Oriental'],
      'Fresh': ['Citrus', 'Floral', 'Aromatic', 'Fresh'],
      'Spicy': ['Oriental', 'Woody', 'Spicy'],
      'Aromatic': ['Citrus', 'Woody', 'Aromatic'],
      'Leather': ['Woody', 'Oriental', 'Leather'],
      'Chypre': ['Floral', 'Woody', 'Chypre']
    };

    const targetFamilies = complementaryMap[currentFamily] || [currentFamily];

    // Filter perfumes
    let candidates = all.filter(p => 
      p['Perfume Name'] !== currentPerfume['Perfume Name'] &&
      targetFamilies.some(f => p['Olfactory Family'].includes(f))
    );

    // If not enough, fallback to same gender
    if (candidates.length < 3) {
      const sameGender = all.filter(p => 
        p['Perfume Name'] !== currentPerfume['Perfume Name'] &&
        p.Gender === currentPerfume.Gender &&
        !candidates.includes(p)
      );
      candidates = [...candidates, ...sameGender];
    }

    // Shuffle and take 3
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    this.pairings.set(shuffled.slice(0, 3));
  }
 
  getSlug(perfume: Perfume): string {
    return this.perfumeService.getSlug(perfume);
  }
 
  onCompareSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const slug = selectElement.value;
    if (slug) {
      const found = this.perfumeService.getPerfumeBySlug(slug);
      if (found) {
        this.comparePerfume.set(found);
        this.compareImpressionPrice.set(this.perfumeService.getImpressionPrice(found['Price (AED)']));
      }
    } else {
      this.comparePerfume.set(undefined);
      this.compareImpressionPrice.set(0);
    }
  }

  updateSEO(perfume: Perfume) {
    const price = this.impressionPrice();
    const title = `${perfume['Perfume Name']} by ${perfume.Brand} Impression | ${price} AED`;
    const description = `Experience our premium impression of ${perfume['Perfume Name']} by ${perfume.Brand}. Featuring key notes of ${perfume['Key Notes']}. Get this luxury fragrance for just ${price} AED.`;
    
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    
    // Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'product' });
    this.metaService.updateTag({ property: 'product:price:amount', content: price.toString() });
    this.metaService.updateTag({ property: 'product:price:currency', content: 'AED' });
    this.metaService.updateTag({ property: 'product:brand', content: perfume.Brand });
    
    // Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }

  buyOnWhatsApp() {
    const p = this.perfume();
    if (!p) return;
    const message = `Hi X Perfumes! I want to buy the impression of ${p['Perfume Name']} by ${p.Brand} for ${this.impressionPrice()} AED.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971585328790?text=${encodedMessage}`, '_blank');
  }
}
