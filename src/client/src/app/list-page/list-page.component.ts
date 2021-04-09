import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { SimpleFirma } from "../../../../shared/Firma";
import { FirmenService, Paged } from "../services/firmen.service";
import {
  FinishedLoading,
  LoadingError,
  LoadingState,
  LoadingStates,
  Reloading,
  StillLoading,
} from "../../../../shared/LoadingStates";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-list-page",
  templateUrl: "./list-page.component.html",
  styleUrls: ["./list-page.component.scss"],
})
export class ListPageComponent implements OnInit, OnDestroy {
  public firmenPage!: Paged<SimpleFirma[]>;
  public firmenLoadingState: LoadingState = StillLoading;

  public LoadingStates = LoadingStates;
  public errorMessage: string | null = null;
  private subscriptions: Subscription[] = [];
  searchQuery: string = "";

  constructor(
    private firmenService: FirmenService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  loadFirmen(page: number): void {
    this.firmenLoadingState = Reloading;
    this.subscriptions.push(
      this.firmenService.getAllSimpleFirmen(page, this.searchQuery).subscribe(
        (allFirmen) => {
          this.firmenPage = allFirmen;
          this.firmenLoadingState = FinishedLoading;
        },
        (err) => {
          console.error(err);
          this.firmenLoadingState = LoadingError;
        }
      )
    );
  }

  private async getDesiredPageNumber(): Promise<number> {
    return new Promise((resolve) => {
      this.activatedRoute.queryParams.subscribe((params) => {
        if (!params["page"]) {
          resolve(0);
        }
        resolve(params["page"] - 1);
      });
    });
  }

  private async getDesiredSearchQuery(): Promise<string> {
    return new Promise((resolve) => {
      this.activatedRoute.queryParams.subscribe((params) => {
        if (!params["query"]) {
          resolve("");
        }
        resolve(params["query"]);
      });
    });
  }

  async ngOnInit(): Promise<void> {
    const page: number = await this.getDesiredPageNumber();
    this.searchQuery = await this.getDesiredSearchQuery();
    this.loadFirmen(page);
  }

  navigateToPage(pageNumber: number) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", `${pageNumber + 1}`);
    url.searchParams.set("query", `${this.searchQuery}`);
    window.history.pushState({}, `Firmen - Page ${pageNumber}`, url.toString());
    this.loadFirmen(pageNumber);
  }

  search(): void {
    const url = new URL(window.location.href);
    url.searchParams.set("page", `1`);
    url.searchParams.set("query", `${this.searchQuery}`);
    window.history.replaceState({}, `Firmen - Page 1`, url.toString());
    this.loadFirmen(0);
  }

  isInitiallyLoaded(firmenLoadingState: LoadingState): boolean {
    return (
      firmenLoadingState === Reloading || firmenLoadingState === FinishedLoading
    );
  }
}
