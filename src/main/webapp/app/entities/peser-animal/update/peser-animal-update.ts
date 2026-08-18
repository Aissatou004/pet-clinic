import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';
import { RendezVousService } from 'app/entities/rendez-vous/service/rendez-vous.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IPeserAnimal } from '../peser-animal.model';
import { PeserAnimalService } from '../service/peser-animal.service';

import { PeserAnimalFormGroup, PeserAnimalFormService } from './peser-animal-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-peser-animal-update',
  templateUrl: './peser-animal-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class PeserAnimalUpdate implements OnInit {
  readonly isSaving = signal(false);
  peserAnimal: IPeserAnimal | null = null;

  rendezVousesCollection = signal<IRendezVous[]>([]);
  animalsSharedCollection = signal<IAnimal[]>([]);

  protected peserAnimalService = inject(PeserAnimalService);
  protected peserAnimalFormService = inject(PeserAnimalFormService);
  protected rendezVousService = inject(RendezVousService);
  protected animalService = inject(AnimalService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PeserAnimalFormGroup = this.peserAnimalFormService.createPeserAnimalFormGroup();

  compareRendezVous = (o1: IRendezVous | null, o2: IRendezVous | null): boolean => this.rendezVousService.compareRendezVous(o1, o2);

  compareAnimal = (o1: IAnimal | null, o2: IAnimal | null): boolean => this.animalService.compareAnimal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ peserAnimal }) => {
      this.peserAnimal = peserAnimal;
      if (peserAnimal) {
        this.updateForm(peserAnimal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const peserAnimal = this.peserAnimalFormService.getPeserAnimal(this.editForm);
    if (peserAnimal.id === null) {
      this.subscribeToSaveResponse(this.peserAnimalService.create(peserAnimal));
    } else {
      this.subscribeToSaveResponse(this.peserAnimalService.update(peserAnimal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPeserAnimal | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(peserAnimal: IPeserAnimal): void {
    this.peserAnimal = peserAnimal;
    this.peserAnimalFormService.resetForm(this.editForm, peserAnimal);

    this.rendezVousesCollection.set(
      this.rendezVousService.addRendezVousToCollectionIfMissing<IRendezVous>(this.rendezVousesCollection(), peserAnimal.rendezVous),
    );
    this.animalsSharedCollection.update(animals => this.animalService.addAnimalToCollectionIfMissing<IAnimal>(animals, peserAnimal.animal));
  }

  protected loadRelationshipsOptions(): void {
    this.rendezVousService
      .query({ filter: 'peseranimal-is-null' })
      .pipe(map((res: HttpResponse<IRendezVous[]>) => res.body ?? []))
      .pipe(
        map((rendezVouses: IRendezVous[]) =>
          this.rendezVousService.addRendezVousToCollectionIfMissing<IRendezVous>(rendezVouses, this.peserAnimal?.rendezVous),
        ),
      )
      .subscribe((rendezVouses: IRendezVous[]) => this.rendezVousesCollection.set(rendezVouses));

    this.animalService
      .query({ size: 2000 })
      .pipe(map((res: HttpResponse<IAnimal[]>) => res.body ?? []))
      .pipe(map((animals: IAnimal[]) => this.animalService.addAnimalToCollectionIfMissing<IAnimal>(animals, this.peserAnimal?.animal)))
      .subscribe((animals: IAnimal[]) => this.animalsSharedCollection.set(animals));
  }
}
