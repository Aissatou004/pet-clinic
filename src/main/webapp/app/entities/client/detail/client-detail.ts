import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';

import { TranslateDirective } from 'app/shared/language';
import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { IClient } from '../client.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-client-detail',
  templateUrl: './client-detail.html',
  imports: [RouterLink, FontAwesomeModule, TranslateDirective, TranslatePipe],
})
export class ClientDetail {
  readonly client = input<IClient | null>(null);
  readonly animals = signal<IAnimal[]>([]);

  protected readonly animalService = inject(AnimalService);

  constructor() {
    effect(() => {
      const currentClient = this.client();
      if (currentClient?.id) {
        this.loadAnimals(currentClient.id);
      }
    });
  }

  loadAnimals(clientId: number): void {
    this.animalService.findByClient(clientId).subscribe(res => {
      if (res.body) {
        this.animals.set(res.body);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
