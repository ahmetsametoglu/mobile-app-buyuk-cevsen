import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PdfService, IPdfPage } from 'src/app/services/pdf.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-menu',
  templateUrl: './content-menu.component.html',
  styleUrls: ['./content-menu.component.scss'],
})
export class ContentMenuComponent implements OnInit, OnDestroy {
  @Output() selectPage: EventEmitter<IPdfPage> = new EventEmitter();
  activePageSubscription: Subscription;

  constructor(private pdfService: PdfService) { }

  contentPages: IPdfPage[] = [];
  activePages: IPdfPage[] = [];

  ngOnInit() {
    this.pdfService.getActivePages().subscribe(pages => {
      this.activePages = pages;
      this.contentPages = pages.filter(p => p.showOnContentMenu);
    });
  }

  ngOnDestroy() {
    if (this.activePageSubscription) {
      this.activePageSubscription.unsubscribe();
    }
  }

  onSelectPage(page: IPdfPage) {
    this.selectPage.emit(page);
  }

}
