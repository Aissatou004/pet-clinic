import { IClinique, NewClinique } from './clinique.model';

export const sampleWithRequiredData: IClinique = {
  id: 24981,
  nom: 'répartir là-haut puisque',
  adresse: 'marier',
  telephone: '0561097374',
};

export const sampleWithPartialData: IClinique = {
  id: 3147,
  nom: 'parce que suivant dans la mesure où',
  adresse: 'aggraver snif',
  telephone: '0181080562',
};

export const sampleWithFullData: IClinique = {
  id: 212,
  nom: 'innombrable là',
  adresse: 'si bien que près',
  telephone: '0343177744',
};

export const sampleWithNewData: NewClinique = {
  nom: 'aigre',
  adresse: 'aux environs de lors',
  telephone: '0139959608',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
