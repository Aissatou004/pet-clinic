import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 16289,
  nom: 'du côté de chialer oh',
  prenom: 'à même ailleurs partenaire',
  telephone: '+33 486690225',
};

export const sampleWithPartialData: IClient = {
  id: 14463,
  nom: 'à seule fin de',
  prenom: 'apaiser',
  adresse: 'tandis que personnel',
  telephone: '0712458332',
  email: '^%@<J.R"~Hi8',
};

export const sampleWithFullData: IClient = {
  id: 31496,
  nom: 'bzzz lectorat séculaire',
  prenom: 'tellement de peur que',
  adresse: 'diplomate',
  telephone: '+33 259588688',
  email: 'Gb@h.~',
};

export const sampleWithNewData: NewClient = {
  nom: 'tôt à la merci',
  prenom: 'infime tranquille',
  telephone: '+33 691076038',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
