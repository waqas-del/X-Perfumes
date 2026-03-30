import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Perfume, PerfumeService } from './perfume.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-stone-50 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div class="flex items-center gap-4">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 text-white shrink-0">
              <mat-icon>water_drop</mat-icon>
            </div>
            <div>
              <h1 class="text-3xl font-serif font-medium tracking-tight text-stone-900 mb-1">Explore All Perfumes</h1>
              <p class="text-stone-500">Discover our collection of 100 premium impressions.</p>
            </div>
          </div>
          <button 
            (click)="goBack()"
            class="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors flex items-center gap-2">
            <mat-icon>arrow_back</mat-icon>
            Back to Quiz
          </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-1">
            <label for="searchInput" class="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Search</label>
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">search</mat-icon>
              <input 
                id="searchInput"
                type="text" 
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                placeholder="Search name, brand..." 
                class="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
              >
            </div>
          </div>
          <div>
            <label for="brandSelect" class="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Brand</label>
            <select 
              id="brandSelect"
              [ngModel]="brandFilter()"
              (ngModelChange)="brandFilter.set($event)"
              class="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all bg-white">
              <option value="">All Brands</option>
              @for (brand of uniqueBrands(); track brand) {
                <option [value]="brand">{{ brand }}</option>
              }
            </select>
          </div>
          <div>
            <label for="genderSelect" class="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Gender</label>
            <select 
              id="genderSelect"
              [ngModel]="genderFilter()"
              (ngModelChange)="genderFilter.set($event)"
              class="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all bg-white">
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label for="familySelect" class="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Family</label>
            <select 
              id="familySelect"
              [ngModel]="familyFilter()"
              (ngModelChange)="familyFilter.set($event)"
              class="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all bg-white">
              <option value="">All Families</option>
              @for (family of uniqueFamilies(); track family) {
                <option [value]="family">{{ family }}</option>
              }
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (perfume of filteredPerfumes(); track perfume['Perfume Name']) {
            <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div class="p-5 flex-grow">
                <div class="flex justify-between items-start mb-3">
                  <a [routerLink]="['/perfume', getSlug(perfume)]" class="group block">
                    <p class="text-[10px] font-medium uppercase tracking-wider text-stone-400 mb-0.5 group-hover:text-stone-600 transition-colors">{{ perfume.Brand }}</p>
                    <h2 class="text-lg font-serif font-medium text-stone-900 leading-tight group-hover:underline">{{ perfume['Perfume Name'] }}</h2>
                  </a>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-800 shrink-0 ml-2">
                    {{ perfume.Gender }}
                  </span>
                </div>

                <div class="space-y-3 mb-4">
                  <div>
                    <p class="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">Family</p>
                    <p class="text-xs font-medium text-stone-800">{{ perfume['Olfactory Family'] }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">Key Notes</p>
                    <p class="text-xs text-stone-700 line-clamp-2">{{ perfume['Key Notes'] }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-stone-50 p-4 border-t border-stone-200 flex justify-between items-center">
                <div>
                  <p class="text-[10px] text-stone-500 line-through">Orig: {{ perfume['Price (AED)'] }} AED</p>
                  <p class="text-sm font-medium text-stone-900">{{ getImpressionPrice(perfume['Price (AED)']) }} AED</p>
                </div>
                <button 
                  (click)="buyOnWhatsApp(perfume)"
                  class="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                  <mat-icon class="text-[16px] w-4 h-4">chat</mat-icon>
                  Buy for {{ getImpressionPrice(perfume['Price (AED)']) }} AED
                </button>
              </div>
            </div>
          }
          
          @if (filteredPerfumes().length === 0) {
            <div class="col-span-full py-12 text-center text-stone-500">
              <mat-icon class="text-4xl mb-2 opacity-50">search_off</mat-icon>
              <p>No perfumes found matching your criteria.</p>
              <button (click)="clearFilters()" class="mt-4 text-stone-900 font-medium hover:underline">Clear filters</button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ExploreComponent {
  private router = inject(Router);
  private perfumeService = inject(PerfumeService);
  
  allPerfumes = this.perfumeService.perfumes;
  
  searchQuery = signal('');
  brandFilter = signal('');
  genderFilter = signal('');
  familyFilter = signal('');

  uniqueBrands = computed(() => {
    const brands = new Set<string>();
    this.allPerfumes.forEach(p => {
      if (p.Brand) brands.add(p.Brand);
    });
    return Array.from(brands).sort();
  });

  uniqueFamilies = computed(() => {
    const families = new Set<string>();
    this.allPerfumes.forEach(p => {
      if (p['Olfactory Family']) families.add(p['Olfactory Family']);
    });
    return Array.from(families).sort();
  });

  filteredPerfumes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const brand = this.brandFilter();
    const gender = this.genderFilter();
    const family = this.familyFilter();

    return this.allPerfumes.filter(p => {
      const matchQuery = !query || 
        p['Perfume Name'].toLowerCase().includes(query) || 
        p.Brand.toLowerCase().includes(query) || 
        p['Key Notes'].toLowerCase().includes(query);
      
      const matchBrand = !brand || p.Brand === brand;
      const matchGender = !gender || p.Gender === gender;
      const matchFamily = !family || p['Olfactory Family'] === family;

      return matchQuery && matchBrand && matchGender && matchFamily;
    });
  });

  updateFilters() {
    // Signals are updated automatically via ngModel bindings
  }

  clearFilters() {
    this.searchQuery.set('');
    this.brandFilter.set('');
    this.genderFilter.set('');
    this.familyFilter.set('');
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

  goBack() {
    this.router.navigate(['/']);
  }
}
