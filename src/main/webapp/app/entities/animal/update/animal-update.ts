import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { Espece } from 'app/entities/enumerations/espece.model';
import { Sexe } from 'app/entities/enumerations/sexe.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAnimal } from '../animal.model';
import { AnimalService } from '../service/animal.service';

import { AnimalFormGroup, AnimalFormService } from './animal-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-animal-update',
  templateUrl: './animal-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class AnimalUpdate implements OnInit {
  readonly isSaving = signal(false);
  animal: IAnimal | null = null;
  especeValues = Object.keys(Espece);
  sexeValues = Object.keys(Sexe);

  clientsSharedCollection = signal<IClient[]>([]);

  protected animalService = inject(AnimalService);
  protected animalFormService = inject(AnimalFormService);
  protected clientService = inject(ClientService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AnimalFormGroup = this.animalFormService.createAnimalFormGroup();

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ animal }) => {
      this.animal = animal;
      if (animal) {
        this.updateForm(animal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const animal = this.animalFormService.getAnimal(this.editForm);
    if (animal.id === null) {
      this.subscribeToSaveResponse(this.animalService.create(animal));
    } else {
      this.subscribeToSaveResponse(this.animalService.update(animal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAnimal | null>): void {
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

  protected updateForm(animal: IAnimal): void {
    this.animal = animal;
    this.animalFormService.resetForm(this.editForm, animal);

    this.clientsSharedCollection.update(clients => this.clientService.addClientToCollectionIfMissing<IClient>(clients, animal.client));
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query({ size: 2000 })
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.animal?.client)))
      .subscribe((clients: IClient[]) => this.clientsSharedCollection.set(clients));
  }
}
