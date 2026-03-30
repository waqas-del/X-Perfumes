import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Perfume, PerfumeService, QuizAnswers } from './perfume.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="min-h-screen bg-stone-50 text-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 text-white mb-4">
            <mat-icon>water_drop</mat-icon>
          </div>
          <h1 class="text-4xl font-serif font-medium tracking-tight text-stone-900 mb-4">Your Signature Scents</h1>
          <p class="text-lg text-stone-500 max-w-2xl mx-auto">Based on your answers, we've curated the top 3 perfume impressions that perfectly match your persona and lifestyle.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          @for (perfume of recommendations(); track perfume['Perfume Name']) {
            <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-4">
                  <a [routerLink]="['/perfume', getSlug(perfume)]" class="group block">
                    <p class="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1 group-hover:text-stone-600 transition-colors">{{ perfume.Brand }}</p>
                    <h2 class="text-2xl font-serif font-medium text-stone-900 group-hover:underline">{{ perfume['Perfume Name'] }}</h2>
                  </a>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                    {{ perfume.Gender }}
                  </span>
                </div>

                <div class="space-y-4 mb-6">
                  <div>
                    <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">Family</p>
                    <p class="text-sm font-medium text-stone-800">{{ perfume['Olfactory Family'] }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">Key Notes</p>
                    <p class="text-sm text-stone-700">{{ perfume['Key Notes'] }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">Longevity</p>
                      <p class="text-sm text-stone-700">{{ perfume.Longevity }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">Sillage</p>
                      <p class="text-sm text-stone-700">{{ perfume.Sillage }}</p>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs text-stone-500 uppercase tracking-wider mb-1">Perfect For</p>
                    <p class="text-sm text-stone-700">{{ perfume['Best Occasion'] }}</p>
                  </div>
                  <div class="pt-4 border-t border-stone-100">
                    <p class="text-sm italic text-stone-600">"{{ perfume['The Perfect Persona'] }}"</p>
                  </div>
                </div>
              </div>

              <div class="bg-stone-50 p-6 border-t border-stone-200">
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <p class="text-xs text-stone-500 line-through">Original: {{ perfume['Price (AED)'] }} AED</p>
                    <p class="text-xl font-medium text-stone-900">Impression: {{ getImpressionPrice(perfume['Price (AED)']) }} AED</p>
                  </div>
                </div>
                <button 
                  (click)="buyOnWhatsApp(perfume)"
                  class="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors">
                  <mat-icon>chat</mat-icon>
                  Buy Impression for {{ getImpressionPrice(perfume['Price (AED)']) }} AED
                </button>
              </div>
            </div>
          }
        </div>

        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            (click)="retakeQuiz()"
            class="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors flex items-center gap-2">
            <mat-icon>refresh</mat-icon>
            Retake Quiz
          </button>
          <button 
            (click)="exploreAll()"
            class="px-6 py-3 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors flex items-center gap-2">
            <mat-icon>search</mat-icon>
            Explore All Perfumes
          </button>
        </div>
      </div>
    </div>
  `
})
export class ResultsComponent implements OnInit {
  private router = inject(Router);
  private perfumeService = inject(PerfumeService);
  private platformId = inject(PLATFORM_ID);
  
  recommendations = signal<Perfume[]>([]);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedAnswers = localStorage.getItem('quizAnswers');
      if (savedAnswers) {
        const answers: QuizAnswers = JSON.parse(savedAnswers);
        this.recommendations.set(this.perfumeService.getRecommendations(answers));
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  getImpressionPrice(priceStr: string): number {
    return this.perfumeService.getImpressionPrice(priceStr);
  }

  getSlug(perfume: Perfume): string {
    return this.perfumeService.getSlug(perfume);
  }

  buyOnWhatsApp(perfume: Perfume) {
    if (isPlatformBrowser(this.platformId)) {
      const price = this.getImpressionPrice(perfume['Price (AED)']);
      const message = `Hi X Perfumes! I want to buy the impression of ${perfume['Perfume Name']} by ${perfume.Brand} for ${price} AED.`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/971585328790?text=${encodedMessage}`, '_blank');
    }
  }

  retakeQuiz() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('quizAnswers');
    }
    this.router.navigate(['/']);
  }

  exploreAll() {
    this.router.navigate(['/explore']);
  }
}
