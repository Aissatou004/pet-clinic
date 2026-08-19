import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [CommonModule],
})
export default class Home implements OnInit {
  private readonly animalService = inject(AnimalService);

  totalAnimals = signal<number | null>(null);
  isLoadingAnimals = signal<boolean>(true);

  ngOnInit(): void {
    this.loadTotalAnimals();
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
}
