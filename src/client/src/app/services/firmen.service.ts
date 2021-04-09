import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Firma, SimpleFirma } from "../../../../shared/Firma";
import { map, tap } from "rxjs/operators";
import { FirmenControllerResponse } from "../../../../shared/api/FirmenController";
import { FirmenAdapter } from "./firmen.adapter";

export type Paged<T> = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  page: T;
};

@Injectable({
  providedIn: "root",
})
export class FirmenService {
  constructor(private firmenAdapter: FirmenAdapter) {}

  public getAllSimpleFirmenSorted(
    page: number
  ): Observable<Paged<SimpleFirma[]>> {
    return this.firmenAdapter
      .getSimpleFirmenList({ page: page.toString() })
      .pipe(
        map<FirmenControllerResponse, Paged<SimpleFirma[]>>((response) => {
          return {
            currentPage: response.currentpage,
            totalPages: response.pages,
            totalCount: response.totalcount,
            page: response.firmen,
          };
        }),
        tap((result) => {
          result.page.sort((a, b) => a.name.localeCompare(b.name));
        })
      );
  }

  public getSpecificFirma(id: number): Observable<Firma> {
    return this.firmenAdapter.getSpecificFirma(id);
  }
}
