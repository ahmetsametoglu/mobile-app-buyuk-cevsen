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
  activePagesSubscription: Subscription;

  constructor(private pdfService: PdfService) { }

  contentPages: IPdfPage[] = [];
  activePages: IPdfPage[] = [];

  ngOnInit() {
    this.activePagesSubscription = this.pdfService.getActivePages().subscribe(pages => {
      this.activePages = pages;
      this.contentPages = pages.filter(p => p.showOnContentMenu);
    });
  }

  ngOnDestroy() {
    if (this.activePagesSubscription) {
      this.activePagesSubscription.unsubscribe();
    }
  }

  onSelectPage(page: IPdfPage) {
    this.selectPage.emit(page);
  }
}
