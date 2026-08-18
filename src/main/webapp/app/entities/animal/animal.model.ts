import dayjs from 'dayjs/esm';

import { IClient } from 'app/entities/client/client.model';
import { Espece } from 'app/entities/enumerations/espece.model';
import { Sexe } from 'app/entities/enumerations/sexe.model';

export interface IAnimal {
  id: number;
  nom?: string | null;
  espece?: keyof typeof Espece | null;
  dateNaissance?: dayjs.Dayjs | null;
  sexe?: keyof typeof Sexe | null;
  client?: IClient | null;
}

export type NewAnimal = Omit<IAnimal, 'id'> & { id: null };
