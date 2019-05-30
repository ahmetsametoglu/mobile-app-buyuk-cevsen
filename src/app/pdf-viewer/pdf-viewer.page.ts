import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.page.html',
  styleUrls: ['./pdf-viewer.page.scss'],
})
export class PdfViewerPage implements OnInit {
  zoom = 1;
  pdfMarginTop = 0;
  pdfMarginLeft = 0;
  currentPage = 1;
  constructor() { }

  ngOnInit() {
  }

  pageRendered() {

  }

}
