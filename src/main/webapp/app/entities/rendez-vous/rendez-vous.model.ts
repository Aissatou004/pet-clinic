import dayjs from 'dayjs/esm';

import { IAnimal } from 'app/entities/animal/animal.model';
import { IClinique } from 'app/entities/clinique/clinique.model';
import { IMedecin } from 'app/entities/medecin/medecin.model';

export interface IRendezVous {
  id: number;
  date?: dayjs.Dayjs | null;
  motif?: string | null;
  duree?: number | null;
  animal?: IAnimal | null;
  clinique?: IClinique | null;
  medecin?: IMedecin | null;
}

export type NewRendezVous = Omit<IRendezVous, 'id'> & { id: null };
