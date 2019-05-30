import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PdfService, IPdfPage } from '../../services/pdf.service';
import { Subscription } from 'rxjs';
import { PopupZoomComponent } from '../../components/popup-zoom/popup-zoom.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.page.html',
  styleUrls: ['./pdf-viewer.page.scss'],
})
export class PdfViewerPage implements OnInit, OnDestroy {
  @ViewChild('pdf_viewer') ngPdfViewer;
  pdfViewerHeight = 0;

  pageSubscription: Subscription;
  zoomSubscription: Subscription;

  zoom = 1;
  pdfMarginTop = 0;
  pdfMarginLeft = 0;
  currentPage: IPdfPage;

  showContentMenu = false;
  showSettingsMenu = false;

  constructor(
    private pdfService: PdfService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.pageSubscription = this.pdfService.getCurrentPage().subscribe(page => {
      if (!!page) {
        this.currentPage = page;
        console.log('currentPage:', this.currentPage);
      }
    });
    this.zoomSubscription = this.pdfService.getZoomFactor().subscribe(zoomFactor => {
      this.zoom = 1 + zoomFactor / 100;
      this.centralizePdf();
      console.log('zoom:', this.zoom);
    });
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }

    if (this.zoomSubscription) {
      this.zoomSubscription.unsubscribe();
    }
  }


  async onShowZoomMenu(ev) {
    const popover = await this.popoverController.create({
      component: PopupZoomComponent,
      event: ev,
      translucent: true,
      cssClass: 'zoom-popover'
    });
    await popover.present();
  }

  onToggleContentMenu() {
    this.showContentMenu = !this.showContentMenu;
  }
  onToggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  pageRendered() {
    this.pdfViewerHeight = this.ngPdfViewer.element.nativeElement.scrollHeight;
  }

  onSwipeRight() {
    this.pdfService.beforePage(this.currentPage);
  }

  onSwipeLeft() {
    this.pdfService.nextPage(this.currentPage);
  }

  onZoomIn(event) {
    this.pdfService.scaleZoomFactor(event.scale);
  }

  onZoomOut(event) {
    this.pdfService.scaleZoomFactor(event.scale);
  }

  centralizePdf() {
    this.pdfMarginLeft = (this.zoom - 1) * -110;
    this.pdfMarginTop = (this.zoom - 1) * -110;
  }
}
