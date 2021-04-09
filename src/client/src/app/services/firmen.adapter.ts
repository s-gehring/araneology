import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as PROPERTIES from "../../../../shared/properties.json";
import { HttpClient } from "@angular/common/http";
import {
  FirmenControllerResponse,
  FirmenControllerSearchQueryParameters,
} from "../../../../shared/api/FirmenController";
import { FirmenDetailsControllerResponse } from "../../../../shared/api/FirmenDetailController";

@Injectable({
  providedIn: "root",
})
export class FirmenAdapter {
  private basepath = `${PROPERTIES.server.protocol}://${PROPERTIES.server.hostname}:${PROPERTIES.server.port}`;
  private getAllFirmenPath = this.basepath + PROPERTIES.server.api.getAllFirmen;
  private getFirmaPath = this.basepath + PROPERTIES.server.api.getSingleFirma;

  constructor(private http: HttpClient) {}

  public getSimpleFirmenList(
    params: FirmenControllerSearchQueryParameters
  ): Observable<FirmenControllerResponse> {
    return this.http.get<FirmenControllerResponse>(this.getAllFirmenPath, {
      params,
    });
  }

  public getSpecificFirma(
    id: number
  ): Observable<FirmenDetailsControllerResponse> {
    return this.http.get<FirmenDetailsControllerResponse>(this.getFirmaPath, {
      params: { id: `${id}` },
    });
  }
}
