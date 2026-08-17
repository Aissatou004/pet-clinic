import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IClinique } from '../clinique.model';
import { CliniqueService } from '../service/clinique.service';

import { CliniqueFormGroup, CliniqueFormService } from './clinique-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-clinique-update',
  templateUrl: './clinique-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CliniqueUpdate implements OnInit {
  readonly isSaving = signal(false);
  clinique: IClinique | null = null;

  protected cliniqueService = inject(CliniqueService);
  protected cliniqueFormService = inject(CliniqueFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CliniqueFormGroup = this.cliniqueFormService.createCliniqueFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clinique }) => {
      this.clinique = clinique;
      if (clinique) {
        this.updateForm(clinique);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const clinique = this.cliniqueFormService.getClinique(this.editForm);
    if (clinique.id === null) {
      this.subscribeToSaveResponse(this.cliniqueService.create(clinique));
    } else {
      this.subscribeToSaveResponse(this.cliniqueService.update(clinique));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IClinique | null>): void {
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

  protected updateForm(clinique: IClinique): void {
    this.clinique = clinique;
    this.cliniqueFormService.resetForm(this.editForm, clinique);
  }
}
