import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-popup-zoom',
  templateUrl: './popup-zoom.component.html',
  styleUrls: ['./popup-zoom.component.scss'],
})
export class PopupZoomComponent implements OnInit {

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
