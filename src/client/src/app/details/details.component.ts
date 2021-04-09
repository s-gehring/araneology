import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import {
  FinishedLoading,
  LoadingError,
  LoadingState,
  LoadingStates,
  StillLoading,
} from "../../../../shared/LoadingStates";
import { Firma } from "../../../../shared/Firma";
import { mergeMap } from "rxjs/operators";
import { FirmenService } from "../services/firmen.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private firmenService: FirmenService
  ) {}

  private subscriptions!: Subscription[];
  public currentLoadingState: LoadingState = StillLoading;
  public LoadingStates = LoadingStates;
  public firma!: Firma;
  loadingErrorMessage: string | null = null;

  ngOnInit(): void {
    this.subscriptions = [
      this.route.params
        .pipe(
          mergeMap<Params, Observable<Firma>>((p) => {
            return this.firmenService.getSpecificFirma(+p["id"]);
          })
        )
        .subscribe(
          (firma) => {
            this.firma = firma;
            this.currentLoadingState = FinishedLoading;
          },
          (err) => {
            this.currentLoadingState = LoadingError;
            this.loadingErrorMessage = JSON.stringify(err);
          }
        ),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
