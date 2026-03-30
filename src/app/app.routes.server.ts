import {RenderMode, ServerRoute} from '@angular/ssr';
import { inject } from '@angular/core';
import { PerfumeService } from './perfume.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'perfume/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const perfumeService = inject(PerfumeService);
      return perfumeService.perfumes.map(p => ({
        slug: perfumeService.getSlug(p)
      }));
    }
  },
  {
    path: 'compare',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
