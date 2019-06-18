import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BookmarkService } from "src/app/services/bookmark.service";
import { take } from "rxjs/operators";
import { PdfService } from "src/app/services/pdf.service";
import { IBookmark } from "src/app/models/bookmark.model";

@Component({
  selector: "app-exit-modal",
  templateUrl: "./exit-modal.component.html",
  styleUrls: ["./exit-modal.component.scss"]
})
export class ExitModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter();

  constructor(
    public bookmarkService: BookmarkService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {}

  async onUpdateAndCloseApp() {
    const currentPage = await this.pdfService
      .getCurrentPage()
      .pipe(take(1))
      .toPromise();

    const currentViewGroup = await this.pdfService
      .getViewGroup()
      .pipe(take(1))
      .toPromise();

    const updatedBookmark: IBookmark = {
      ...this.bookmarkService.activeBookmark,
      pageNumber: currentPage.pageNumber,
      description: currentPage.description,
      viewGroup: currentViewGroup
    };
    this.bookmarkService.saveUpdateBookmark(updatedBookmark);

    this.onCloseApp();
  }

  onCloseApp() {
    navigator["app"].exitApp();
  }

  onCancel() {
    this.closeModal.emit();
  }
}
