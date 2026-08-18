import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { IClinique } from 'app/entities/clinique/clinique.model';
import { CliniqueService } from 'app/entities/clinique/service/clinique.service';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { MedecinService } from 'app/entities/medecin/service/medecin.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IRendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';

import { RendezVousFormGroup, RendezVousFormService } from './rendez-vous-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-rendez-vous-update',
  templateUrl: './rendez-vous-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class RendezVousUpdate implements OnInit {
  readonly isSaving = signal(false);
  rendezVous: IRendezVous | null = null;

  animalsSharedCollection = signal<IAnimal[]>([]);
  cliniquesSharedCollection = signal<IClinique[]>([]);
  medecinsSharedCollection = signal<IMedecin[]>([]);

  protected rendezVousService = inject(RendezVousService);
  protected rendezVousFormService = inject(RendezVousFormService);
  protected animalService = inject(AnimalService);
  protected cliniqueService = inject(CliniqueService);
  protected medecinService = inject(MedecinService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RendezVousFormGroup = this.rendezVousFormService.createRendezVousFormGroup();

  compareAnimal = (o1: IAnimal | null, o2: IAnimal | null): boolean => this.animalService.compareAnimal(o1, o2);

  compareClinique = (o1: IClinique | null, o2: IClinique | null): boolean => this.cliniqueService.compareClinique(o1, o2);

  compareMedecin = (o1: IMedecin | null, o2: IMedecin | null): boolean => this.medecinService.compareMedecin(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rendezVous }) => {
      this.rendezVous = rendezVous;
      if (rendezVous) {
        this.updateForm(rendezVous);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const rendezVous = this.rendezVousFormService.getRendezVous(this.editForm);
    if (rendezVous.id === null) {
      this.subscribeToSaveResponse(this.rendezVousService.create(rendezVous));
    } else {
      this.subscribeToSaveResponse(this.rendezVousService.update(rendezVous));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IRendezVous | null>): void {
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

  protected updateForm(rendezVous: IRendezVous): void {
    this.rendezVous = rendezVous;
    this.rendezVousFormService.resetForm(this.editForm, rendezVous);

    this.animalsSharedCollection.update(animals => this.animalService.addAnimalToCollectionIfMissing<IAnimal>(animals, rendezVous.animal));
    this.cliniquesSharedCollection.update(cliniques =>
      this.cliniqueService.addCliniqueToCollectionIfMissing<IClinique>(cliniques, rendezVous.clinique),
    );
    this.medecinsSharedCollection.update(medecins =>
      this.medecinService.addMedecinToCollectionIfMissing<IMedecin>(medecins, rendezVous.medecin),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.animalService
      .query()
      .pipe(map((res: HttpResponse<IAnimal[]>) => res.body ?? []))
      .pipe(map((animals: IAnimal[]) => this.animalService.addAnimalToCollectionIfMissing<IAnimal>(animals, this.rendezVous?.animal)))
      .subscribe((animals: IAnimal[]) => this.animalsSharedCollection.set(animals));

    this.cliniqueService
      .query()
      .pipe(map((res: HttpResponse<IClinique[]>) => res.body ?? []))
      .pipe(
        map((cliniques: IClinique[]) =>
          this.cliniqueService.addCliniqueToCollectionIfMissing<IClinique>(cliniques, this.rendezVous?.clinique),
        ),
      )
      .subscribe((cliniques: IClinique[]) => this.cliniquesSharedCollection.set(cliniques));

    this.medecinService
      .query()
      .pipe(map((res: HttpResponse<IMedecin[]>) => res.body ?? []))
      .pipe(
        map((medecins: IMedecin[]) => this.medecinService.addMedecinToCollectionIfMissing<IMedecin>(medecins, this.rendezVous?.medecin)),
      )
      .subscribe((medecins: IMedecin[]) => this.medecinsSharedCollection.set(medecins));
  }
}
