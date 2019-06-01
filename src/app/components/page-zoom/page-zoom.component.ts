import { Component, OnInit } from '@angular/core';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-page-zoom',
  templateUrl: './page-zoom.component.html',
  styleUrls: ['./page-zoom.component.scss'],
})
export class PageZoomComponent implements OnInit {

  constructor(private pdfService: PdfService) { }
  zoomFactor = 1;

  ngOnInit() {
    this.pdfService.getZoomFactor().subscribe(zoomFactor => {
        this.zoomFactor = zoomFactor;
      });
  }

  onChangeZoom(event: any) {
    this.zoomFactor = event.detail.value;
    this.pdfService.setZoomFactor(this.zoomFactor);
  }

}
