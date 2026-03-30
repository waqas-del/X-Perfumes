import { Routes } from '@angular/router';
import { QuizComponent } from './quiz.component';
import { ResultsComponent } from './results.component';
import { ExploreComponent } from './explore.component';
import { PerfumeDetailComponent } from './perfume-detail.component';
import { CompareComponent } from './compare.component';

export const routes: Routes = [
  { path: '', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'perfume/:slug', component: PerfumeDetailComponent },
  { path: '**', redirectTo: '' }
];
