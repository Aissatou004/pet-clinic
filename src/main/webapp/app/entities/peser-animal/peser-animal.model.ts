import { IAnimal } from 'app/entities/animal/animal.model';
import { IRendezVous } from 'app/entities/rendez-vous/rendez-vous.model';

export interface IPeserAnimal {
  id: number;
  poids?: number | null;
  rendezVous?: IRendezVous | null;
  animal?: IAnimal | null;
}

export type NewPeserAnimal = Omit<IPeserAnimal, 'id'> & { id: null };
