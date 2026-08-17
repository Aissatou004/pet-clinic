import dayjs from 'dayjs/esm';

import { IRendezVous, NewRendezVous } from './rendez-vous.model';

export const sampleWithRequiredData: IRendezVous = {
  id: 19768,
  date: dayjs('2026-08-17T09:41'),
  motif: 'apparemment',
  duree: 31249.48,
};

export const sampleWithPartialData: IRendezVous = {
  id: 29663,
  date: dayjs('2026-08-17T02:41'),
  motif: 'aussitôt que sitôt que amorphe',
  duree: 15840.9,
};

export const sampleWithFullData: IRendezVous = {
  id: 19313,
  date: dayjs('2026-08-17T04:55'),
  motif: 'psitt autrement via',
  duree: 8139.01,
};

export const sampleWithNewData: NewRendezVous = {
  date: dayjs('2026-08-17T12:32'),
  motif: 'hôte',
  duree: 13904.86,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
