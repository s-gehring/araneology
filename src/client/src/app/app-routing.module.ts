import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListPageComponent } from "./list-page/list-page.component";
import { DetailsComponent } from "./details/details.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "firmen",
    pathMatch: "full",
  },
  {
    path: "firmen",
    component: ListPageComponent,
    pathMatch: "full",
  },
  {
    path: "firmen/:id",
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
