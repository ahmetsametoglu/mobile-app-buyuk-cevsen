import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { PdfService, IPdfPage, ViewGroupName } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.scss'],
})
export class PageBarComponent implements OnInit, OnDestroy {
  @Output() selectPage: EventEmitter<IPdfPage> = new EventEmitter();

  activePagesSubscription: Subscription;
  currentPageSubscription: Subscription;

  constructor(private pdfService: PdfService) { }

  activePages: IPdfPage[] = [];
  currentPage: IPdfPage;
  lastPage: IPdfPage;
  firstPage: IPdfPage;
  selectedPage: IPdfPage;

  ngOnInit() {
    this.activePagesSubscription = this.pdfService.getActivePages().subscribe(pages => {
      this.activePages = pages;
      this.firstPage = pages[0];
      this.lastPage = pages[pages.length - 1];
    });

    this.currentPageSubscription = this.pdfService.getCurrentPage().subscribe(currentPage => {
      this.currentPage = currentPage;
      this.selectedPage = { ...currentPage };
    });
  }

  ngOnDestroy() {
    if (this.activePagesSubscription) {
      this.activePagesSubscription.unsubscribe();
    }
    if (this.currentPageSubscription) {
      this.currentPageSubscription.unsubscribe();
    }
  }

  onSelectPage(event) {

    const pageIndex = Number(event.detail.value);
    const page = this.activePages[pageIndex];
    if (!!page) {
      this.selectedPage = page;
    }
  }

  goToPage() {
    this.selectPage.emit(this.selectedPage);
  }


}
