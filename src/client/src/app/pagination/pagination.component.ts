import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  @Input()
  currentPage: number = 0;

  @Input()
  totalPages: number = 1;

  @Output()
  pageClicked: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  go(number: number): void {
    this.pageClicked.emit(number);
  }

  showPageNumber(page: number): string {
    return page + 1 + "";
  }
}
