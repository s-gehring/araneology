import { Insolvenzregisterbekanntmachung } from "./Insolvenzregisterbekanntmachung";
import { Handelsregisterbekanntmachung } from "./Handelsregisterbekanntmachung";

export interface Firma {
  name: string;
  id: number;
  haRes: Handelsregisterbekanntmachung[];
  insos: Insolvenzregisterbekanntmachung[];
}

export type SimpleFirma = Pick<Firma, "name" | "id">;
