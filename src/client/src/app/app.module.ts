import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app/app.component";
import { ListPageComponent } from "./list-page/list-page.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ErrorComponent } from "./error/error.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HttpClientModule } from "@angular/common/http";
import { DetailsComponent } from "./details/details.component";
import { BackComponent } from "./back/back.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    ListPageComponent,
    ErrorComponent,
    DetailsComponent,
    BackComponent,
    PaginationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatSidenavModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
