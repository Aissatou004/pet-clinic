import { IClinique } from 'app/entities/clinique/clinique.model';

export interface IMedecin {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  specialite?: string | null;
  email?: string | null;
  telephone?: string | null;
  clinique?: IClinique | null;
}

export type NewMedecin = Omit<IMedecin, 'id'> & { id: null };
