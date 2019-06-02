import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { PdfService, IPdfPage, IViewGroup, NavigationSide } from '../../services/pdf.service';
import { Subscription } from 'rxjs';
import { PageZoomComponent } from '../../components/page-zoom/page-zoom.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [
    trigger('contentMenu', [
      state('show', style({ transform: 'translateX(0)', opacity: 1 })),
      state('hide', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('settingsMenu', [
      state('show', style({ transform: 'translateX(0)', opacity: 1 })),
      state('hide', style({ transform: 'translateX(100%)', opacity: 0 })),
      transition('* => *', animate(500))
    ]),
    trigger('pageInfoAnimation', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('show => hide', animate(1000))
    ]),
  ]
})
export class HomePage implements OnInit, OnDestroy {
  navigationSide = NavigationSide;
  @ViewChild('pdf_viewer') ngPdfViewer;
  pdfViewerHeight = 0;
  title = 'Büyük Cevşen';

  pageSubscription: Subscription;
  viewGroupSubscription: Subscription;
  zoomSubscription: Subscription;

  zoom = 1;
  pdfMarginTop = 0;
  pdfMarginLeft = 0;
  currentPage: IPdfPage;
  viewGroup: IViewGroup;

  showContentMenu = false;
  showSettingsMenu = false;
  showPageInfo = false;

  isNightModeActive = false;

  constructor(
    private pdfService: PdfService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.pageSubscription = this.pdfService.getCurrentPage().subscribe(page => {
      if (!!page) {
        if (!this.currentPage || page.pageNumber !== this.currentPage.pageNumber) {
          this.onShowPageInfo();
        }
        this.currentPage = page;
        console.log('currentPage:', this.currentPage);
      }
    });
    this.zoomSubscription = this.pdfService.getZoomFactor().subscribe(zoomFactor => {
      this.zoom = 1 + zoomFactor / 100;
      this.centralizePdf();
      console.log('zoom:', this.zoom);
    });
    this.viewGroupSubscription = this.pdfService.getViewGroup().subscribe(viewGroup => {
      this.viewGroup = viewGroup;
    });
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }

    if (this.zoomSubscription) {
      this.zoomSubscription.unsubscribe();
    }

    if (this.viewGroupSubscription) {
      this.viewGroupSubscription.unsubscribe();
    }
  }


  async onShowZoomMenu(ev) {
    const popover = await this.popoverController.create({
      component: PageZoomComponent,
      event: ev,
      translucent: true,
      cssClass: 'page-zoom'
    });
    await popover.present();
  }

  onToggleContentMenu() {
    this.showContentMenu = !this.showContentMenu;
    if (this.showContentMenu) {
      this.showSettingsMenu = false;
    }
    if (this.showContentMenu) {
      this.title = 'İçindekiler';
    } else if (!this.showSettingsMenu) {
      this.title = 'Büyük Cevşen';
    }
  }
  onToggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
    if (this.showSettingsMenu) {
      this.showContentMenu = false;
    }
    if (this.showSettingsMenu) {
      this.title = 'Ayarlar';
    } else if (!this.showContentMenu) {
      this.title = 'Büyük Cevşen';
    }
  }

  pageRendered() {
    this.pdfViewerHeight = this.ngPdfViewer.element.nativeElement.scrollHeight;
  }


  onChangePage(navSide: NavigationSide) {
    if (this.viewGroup.navSide === navSide) {
      this.pdfService.nextPage(this.currentPage);
    } else {
      this.pdfService.beforePage(this.currentPage);
    }
  }

  onZoomIn(event) {
    this.pdfService.scaleZoomFactor(event.scale);
  }

  onZoomOut(event) {
    this.pdfService.scaleZoomFactor(event.scale);
  }

  onSelectPage(page) {
    this.pdfService.setCurrentPage(page);
    this.showContentMenu = false;
  }

  centralizePdf() {
    this.pdfMarginLeft = (this.zoom - 1) * -110;
    this.pdfMarginTop = (this.zoom - 1) * -110;
  }

  onShowPageInfo() {
    this.showPageInfo = true;
    setTimeout(() => {
      this.showPageInfo = false;
    }, 300);
  }
}
