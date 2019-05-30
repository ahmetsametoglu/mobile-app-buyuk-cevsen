import { Component, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../services/pdf.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.page.html',
  styleUrls: ['./pdf-viewer.page.scss'],
})
export class PdfViewerPage implements OnInit {
  @ViewChild('pdf_viewer') ngPdfViewer;
  pdfViewerHeight = 0;
  zoom = 1;
  pdfMarginTop = 0;
  pdfMarginLeft = 0;
  currentPage = 1;

  constructor(private pdfService: PdfService) { }

  ngOnInit() {
  }

  pageRendered() {
    this.pdfViewerHeight = this.ngPdfViewer.element.nativeElement.scrollHeight;
  }

}
