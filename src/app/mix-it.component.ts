import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Perfume, PerfumeService } from './perfume.service';

interface MixSlot {
  perfume: Perfume | null;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-mix-it',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#FDF8F3] text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div class="flex items-center gap-4">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 text-white shrink-0">
              <mat-icon>science</mat-icon>
            </div>
            <div>
              <h1 class="text-3xl font-serif font-medium tracking-tight text-stone-900 mb-1">Mix IT</h1>
              <p class="text-stone-500">Create your own unique signature scent by blending your favorites.</p>
            </div>
          </div>
          <button 
            routerLink="/explore"
            class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors flex items-center gap-2">
            <mat-icon>arrow_back</mat-icon>
            Back to Explore
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Side: Visual Bottle -->
          <div class="relative flex justify-center items-center h-[600px]">
            <!-- Bottle SVG -->
            <div class="relative w-64 h-96">
              <!-- Bottle Cap -->
              <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-amber-200 to-amber-500 rounded-t-lg border-b-4 border-amber-600 shadow-lg z-20"></div>
              
              <!-- Bottle Neck -->
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-8 bg-stone-200/50 border-x-2 border-stone-300/30 z-10"></div>

              <!-- Bottle Body -->
              <div class="absolute inset-0 bg-white/20 backdrop-blur-sm border-4 border-white/40 rounded-[40px] shadow-2xl overflow-hidden z-10">
                <!-- Liquid Layers -->
                <div class="absolute inset-0 flex flex-col-reverse">
                  @for (slot of slots(); track $index) {
                    @if (slot.perfume && slot.percentage > 0) {
                      <div 
                        class="transition-all duration-500 ease-out relative group"
                        [style.height.%]="slot.percentage"
                        [style.background-color]="slot.color">
                        <!-- Bubbles effect -->
                        <div class="absolute inset-0 opacity-20 pointer-events-none">
                          <div class="bubble w-1 h-1 bg-white rounded-full absolute bottom-2 left-1/4 animate-bounce"></div>
                          <div class="bubble w-2 h-2 bg-white rounded-full absolute bottom-4 left-2/3 animate-bounce delay-75"></div>
                          <div class="bubble w-1 h-1 bg-white rounded-full absolute bottom-8 left-1/2 animate-bounce delay-150"></div>
                        </div>
                        <!-- Tooltip on hover -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white text-[10px] font-bold uppercase tracking-tighter text-center px-2">
                          {{ slot.perfume['Perfume Name'] }} ({{ slot.percentage }}%)
                        </div>
                      </div>
                    }
                  }
                  <!-- Empty space -->
                  <div class="flex-grow bg-stone-100/10"></div>
                </div>
                
                <!-- Glass Reflection -->
                <div class="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/30"></div>
                <div class="absolute top-0 left-4 w-2 h-full bg-white/10 rounded-full blur-[1px]"></div>
              </div>
              
              <!-- Total Percentage Badge -->
              <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div class="text-4xl font-serif font-bold" [class.text-green-600]="totalPercentage() === 100" [class.text-amber-600]="totalPercentage() !== 100">
                  {{ totalPercentage() }}%
                </div>
                <div class="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Total Blend</div>
              </div>
            </div>
          </div>

          <!-- Right Side: Controls -->
          <div class="space-y-8">
            <h2 class="text-2xl font-serif text-center mb-8">Choose Two Or More Fragrances</h2>

            @for (slot of slots(); track $index; let i = $index) {
              <div class="space-y-4 bg-white/50 p-6 rounded-3xl border border-stone-200/50 shadow-sm transition-all hover:shadow-md">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Brand Select -->
                  <div class="relative">
                    <select 
                      class="w-full appearance-none bg-white border border-stone-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all text-sm"
                      (change)="onBrandChange(i, $event)">
                      <option value="">Select Brand</option>
                      @for (brand of brands(); track brand) {
                        <option [value]="brand" [selected]="slot.perfume?.Brand === brand">{{ brand }}</option>
                      }
                    </select>
                    <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">expand_more</mat-icon>
                  </div>

                  <!-- Perfume Select -->
                  <div class="relative">
                    <select 
                      class="w-full appearance-none bg-white border border-stone-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all text-sm"
                      [disabled]="!getBrandPerfumes(i).length"
                      (change)="onPerfumeChange(i, $event)">
                      <option value="">Select Fragrance</option>
                      @for (p of getBrandPerfumes(i); track p['Perfume Name']) {
                        <option [value]="p['Perfume Name']" [selected]="slot.perfume?.['Perfume Name'] === p['Perfume Name']">{{ p['Perfume Name'] }}</option>
                      }
                    </select>
                    <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">expand_more</mat-icon>
                  </div>
                </div>

                <!-- Percentage Slider -->
                <div class="space-y-2">
                  <div class="flex justify-center">
                    <div class="w-12 h-12 rounded-full border-2 border-stone-900 flex items-center justify-center font-bold text-sm bg-white">
                      {{ slot.percentage }}%
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-[10px] font-bold text-stone-400">0%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      [value]="slot.percentage"
                      (input)="onPercentageChange(i, $event)"
                      class="flex-grow h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900">
                    <span class="text-[10px] font-bold text-stone-400">100%</span>
                  </div>
                </div>
              </div>
            }

            <!-- Bottom Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <input 
                type="text" 
                [(ngModel)]="scentName"
                placeholder="Name Your Scent"
                class="w-full bg-white border border-stone-200 rounded-full px-6 py-4 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all text-sm">
              
              <button 
                (click)="addToCart()"
                [disabled]="totalPercentage() !== 100 || !scentName"
                class="w-full bg-stone-900 text-white rounded-full px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95">
                Order Custom Blend
              </button>
            </div>

            @if (totalPercentage() !== 100) {
              <p class="text-center text-xs text-amber-600 font-medium animate-pulse">
                Total percentage must be exactly 100% (Current: {{ totalPercentage() }}%)
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #78350f; /* amber-900 */
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .bubble {
      animation: float 3s infinite ease-in-out;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
      50% { transform: translateY(-20px) translateX(5px); opacity: 0.5; }
    }
  `]
})
export class MixItComponent implements OnInit {
  private perfumeService = inject(PerfumeService);
  private route = inject(ActivatedRoute);
  
  brands = computed(() => Array.from(new Set(this.perfumeService.perfumes().map((p: Perfume) => p.Brand))).sort());
  
  slots = signal<MixSlot[]>([
    { perfume: null, percentage: 50, color: '#E5D3B3' },
    { perfume: null, percentage: 50, color: '#D4B483' },
    { perfume: null, percentage: 0, color: '#C19A6B' }
  ]);

  scentName = '';

  totalPercentage = computed(() => {
    return this.slots().reduce((sum: number, slot: MixSlot) => sum + slot.percentage, 0);
  });

  async ngOnInit() {
    await this.perfumeService.ensureLoaded();
    this.route.queryParamMap.subscribe(params => {
      const p1Slug = params.get('p1');
      const p2Slug = params.get('p2');

      if (p1Slug || p2Slug) {
        const newSlots = [...this.slots()];
        if (p1Slug) {
          const p1 = this.perfumeService.getPerfumeBySlug(p1Slug);
          if (p1) newSlots[0].perfume = p1;
        }
        if (p2Slug) {
          const p2 = this.perfumeService.getPerfumeBySlug(p2Slug);
          if (p2) newSlots[1].perfume = p2;
        }
        this.slots.set(newSlots);
      }
    });
  }

  getBrandPerfumes(index: number): Perfume[] {
    const slot = this.slots()[index];
    const brand = slot.perfume?.Brand;
    if (!brand) return [];
    return this.perfumeService.perfumes().filter((p: Perfume) => p.Brand === brand);
  }

  onBrandChange(index: number, event: Event) {
    const brand = (event.target as HTMLSelectElement).value;
    const newSlots = [...this.slots()];
    newSlots[index] = { ...newSlots[index], perfume: brand ? { Brand: brand } as Perfume : null };
    this.slots.set(newSlots);
  }

  onPerfumeChange(index: number, event: Event) {
    const name = (event.target as HTMLSelectElement).value;
    const brand = this.slots()[index].perfume?.Brand;
    const perfume = this.perfumeService.perfumes().find((p: Perfume) => p.Brand === brand && p['Perfume Name'] === name);
    
    const newSlots = [...this.slots()];
    newSlots[index] = { ...newSlots[index], perfume: perfume || null };
    this.slots.set(newSlots);
  }

  onPercentageChange(index: number, event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    const newSlots = [...this.slots()];
    newSlots[index] = { ...newSlots[index], percentage: val };
    this.slots.set(newSlots);
  }

  addToCart() {
    if (this.totalPercentage() !== 100) return;
    
    const mixDetails = this.slots()
      .filter(s => s.perfume && s.percentage > 0)
      .map(s => `${s.percentage}% ${s.perfume?.['Perfume Name']} (${s.perfume?.Brand})`)
      .join(', ');

    const message = `Hi X Perfumes! I want to order my custom blend "${this.scentName}": ${mixDetails}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971585328790?text=${encodedMessage}`, '_blank');
  }
}
