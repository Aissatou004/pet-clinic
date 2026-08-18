import { IMedecin, NewMedecin } from './medecin.model';

export const sampleWithRequiredData: IMedecin = {
  id: 3958,
  nom: 'engendrer vlan',
  prenom: 'jusque',
  specialite: 'entre',
  email: 'a_ZSOw@xPjX.,_dC',
};

export const sampleWithPartialData: IMedecin = {
  id: 1254,
  nom: 'formuler',
  prenom: 'plaisanter',
  specialite: 'là-haut bien que',
  email: 'pU0_o@INr.b4rrB',
};

export const sampleWithFullData: IMedecin = {
  id: 22099,
  nom: 'concernant à même bien que',
  prenom: 'étant donné que feindre vu que',
  specialite: 'super préférer',
  email: 'OuQ{I@Ux?.<$|/{',
  telephone: '+33 172990237',
};

export const sampleWithNewData: NewMedecin = {
  nom: 'hé',
  prenom: 'sous géométrique de façon que',
  specialite: 'aussitôt que',
  email: '#S@0QXp_.<)"',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
