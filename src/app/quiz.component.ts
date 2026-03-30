import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { QuizAnswers } from './perfume.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-stone-50 text-stone-900 flex flex-col items-center justify-center p-4">
      <div class="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-900 text-white mb-4">
            <mat-icon class="text-3xl w-8 h-8">water_drop</mat-icon>
          </div>
          <h1 class="text-3xl font-serif font-medium tracking-tight text-stone-900 mb-2">X Perfumes Impressions</h1>
          <p class="text-stone-500">Find your perfect signature scent based on your personality and lifestyle.</p>
        </div>

        @if (currentQuestionIndex() < questions.length) {
          <div class="mb-6">
            <div class="flex justify-between text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">
              <span>Question {{ currentQuestionIndex() + 1 }} of {{ questions.length }}</span>
            </div>
            <div class="w-full bg-stone-100 rounded-full h-1.5 mb-6">
              <div class="bg-stone-900 h-1.5 rounded-full transition-all duration-500" [style.width]="((currentQuestionIndex() + 1) / questions.length * 100) + '%'"></div>
            </div>
            
            <h2 class="text-xl font-medium mb-6">{{ questions[currentQuestionIndex()].text }}</h2>
            
            <div class="space-y-3">
              @for (option of questions[currentQuestionIndex()].options; track option) {
                <button 
                  (click)="selectOption(option)"
                  class="w-full text-left px-6 py-4 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-colors flex items-center justify-between group">
                  <span class="font-medium text-stone-700 group-hover:text-stone-900">{{ option }}</span>
                  <mat-icon class="text-stone-300 group-hover:text-stone-900 transition-colors">arrow_forward</mat-icon>
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class QuizComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  currentQuestionIndex = signal(0);
  answers: Partial<QuizAnswers> = {};

  questions = [
    {
      id: 'gender',
      text: 'Who are you shopping for?',
      options: ['Him', 'Her', 'Unisex']
    },
    {
      id: 'profession',
      text: 'Which best describes your daily environment or profession?',
      options: [
        'Corporate / Office',
        'Creative / Artistic',
        'Student / Casual',
        'Entrepreneur / Leader',
        'Healthcare / Service'
      ]
    },
    {
      id: 'occasion',
      text: 'When do you plan to wear this perfume the most?',
      options: [
        'Daily Wear / Office',
        'Date Night / Romance',
        'Clubbing / Parties',
        'Formal Events / Weddings',
        'Casual / Weekends'
      ]
    },
    {
      id: 'type',
      text: 'What type of scent profile do you usually gravitate towards?',
      options: [
        'Fresh / Citrus / Aquatic',
        'Woody / Spicy',
        'Floral / Fruity',
        'Sweet / Gourmand / Vanilla',
        'Leather / Oud / Smoky'
      ]
    },
    {
      id: 'season',
      text: 'Which season are you primarily buying this for?',
      options: [
        'Summer / Spring',
        'Winter / Autumn',
        'All Seasons'
      ]
    },
    {
      id: 'persona',
      text: 'How would you describe your ideal persona?',
      options: [
        'Confident & Ambitious',
        'Elegant & Sophisticated',
        'Playful & Energetic',
        'Mysterious & Seductive',
        'Calm & Grounded'
      ]
    }
  ];

  selectOption(option: string) {
    const currentQ = this.questions[this.currentQuestionIndex()];
    this.answers[currentQ.id as keyof QuizAnswers] = option;

    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    } else {
      // Finished quiz
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
      }
      this.router.navigate(['/results']);
    }
  }
}
