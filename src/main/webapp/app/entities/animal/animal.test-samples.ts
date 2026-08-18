import dayjs from 'dayjs/esm';

import { IAnimal, NewAnimal } from './animal.model';

export const sampleWithRequiredData: IAnimal = {
  id: 15325,
  nom: 'crac conférer',
  espece: 'VACHE',
  dateNaissance: dayjs('2026-08-17'),
};

export const sampleWithPartialData: IAnimal = {
  id: 8953,
  nom: 'près de de manière à ce que calme',
  espece: 'AUTRE',
  dateNaissance: dayjs('2026-08-16'),
  sexe: 'MALE',
};

export const sampleWithFullData: IAnimal = {
  id: 28924,
  nom: 'bientôt',
  espece: 'CHEVRE',
  dateNaissance: dayjs('2026-08-16'),
  sexe: 'FEMELLE',
};

export const sampleWithNewData: NewAnimal = {
  nom: 'timide',
  espece: 'VACHE',
  dateNaissance: dayjs('2026-08-17'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
