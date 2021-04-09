import { Controller } from "./Controller";
import { FirmenController } from "./controllers/FirmenController/FirmenController";
import { FirmenDetailController } from "./controllers/FirmenDetailController/FirmenDetailController";

export const Controllers: Array<Controller> = [
  new FirmenDetailController(),
  new FirmenController(),
];
