import { SimpleFirma } from "../Firma";

export type FirmenControllerResponse = {
  firmen: SimpleFirma[];
  pages: number;
  currentpage: number;
  totalcount: number;
};

export type FirmenControllerQueryParameters = {
  page: string;
};
