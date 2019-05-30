import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PdfService, IPdfPage } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-content-menu',
  templateUrl: './content-menu.component.html',
  styleUrls: ['./content-menu.component.scss'],
})
export class ContentMenuComponent implements OnInit {
  @Output() selectPage: EventEmitter<IPdfPage> = new EventEmitter();
  constructor(private pdfService: PdfService) { }
  contentPages: IPdfPage[] = [];

  ngOnInit() {
    this.contentPages = this.pdfService.getContentPages();
  }

  onSelectPage(page: IPdfPage) {
    this.selectPage.emit(page);
  }

}
