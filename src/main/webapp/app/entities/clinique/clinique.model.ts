export interface IClinique {
  id: number;
  nom?: string | null;
  adresse?: string | null;
  telephone?: string | null;
}

export type NewClinique = Omit<IClinique, 'id'> & { id: null };
