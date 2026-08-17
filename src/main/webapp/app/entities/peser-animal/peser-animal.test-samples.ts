import { IPeserAnimal, NewPeserAnimal } from './peser-animal.model';

export const sampleWithRequiredData: IPeserAnimal = {
  id: 23899,
  poids: 2016.06,
};

export const sampleWithPartialData: IPeserAnimal = {
  id: 27161,
  poids: 13606.05,
};

export const sampleWithFullData: IPeserAnimal = {
  id: 11647,
  poids: 26083.62,
};

export const sampleWithNewData: NewPeserAnimal = {
  poids: 1630.03,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
