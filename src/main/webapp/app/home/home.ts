import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';
import { RendezVousService } from 'app/entities/rendez-vous/service/rendez-vous.service';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [CommonModule, DatePipe],
})
export default class Home implements OnInit {
  private readonly animalService = inject(AnimalService);
  private readonly rendezVousService = inject(RendezVousService);

  totalAnimals = signal<number | null>(null);
  isLoadingAnimals = signal<boolean>(true);

  totalRendezVous = signal<number | null>(null);
  rendezVousToday = signal<IRendezVous[]>([]);
  isLoadingRendezVous = signal<boolean>(true);

  ngOnInit(): void {
    this.loadTotalAnimals();
    this.loadRendezVous();
  }

  loadTotalAnimals() {
    this.animalService.countTotal().subscribe({
      next: res => {
        const totalHeaders = res.headers.get('X-Total-Count');
        const count = totalHeaders ? parseInt(totalHeaders, 10) : (res.body?.length ?? 0);

        this.totalAnimals.set(count);
        this.isLoadingAnimals.set(false);
      },
      error: () => {
        this.totalAnimals.set(0);
        this.isLoadingAnimals.set(false);
      },
    });
  }

  loadRendezVous() {
    this.rendezVousService.rendezVousToday().subscribe({
      next: res => {
        console.log('Données reçues du serveur :', res);
        this.totalRendezVous.set(res.length);
        this.rendezVousToday.set(res);
        this.isLoadingRendezVous.set(false);
      },
      error: () => {
        this.totalRendezVous.set(0);
        this.rendezVousToday.set([]);
        this.isLoadingRendezVous.set(false);
      },
    });
  }
}
