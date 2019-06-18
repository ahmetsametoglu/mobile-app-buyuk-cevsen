import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { PdfService } from "../../services/pdf.service";
import { Subscription } from "rxjs";
import { AppRateService } from "src/app/services/app-rate.service";
import { NavigationSide, IViewGroup } from "src/app/models/view-group.model";
import { IPdfPage } from "src/app/models/pdfpage.model";
import { Platform } from "@ionic/angular";

const ScrollLeftFactor = 0.394;
const ScrollTopFactor = 0.08;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  animations: [
    trigger("contentMenu", [
      state("show", style({ transform: "translateX(0)", opacity: 1 })),
      state("hide", style({ transform: "translateX(-100%)", opacity: 0 })),
      transition("* => *", animate(500))
    ]),
    trigger("settingsMenu", [
      state("show", style({ transform: "translateX(0)", opacity: 1 })),
      state("hide", style({ transform: "translateX(100%)", opacity: 0 })),
      transition("* => *", animate(500))
    ]),
    trigger("pageInfoAnimation", [
      state("show", style({ opacity: 1 })),
      state("hide", style({ opacity: 0 })),
      transition("show => hide", animate(1000))
    ])
  ]
})
export class HomePage implements OnInit, OnDestroy {
  navigationSide = NavigationSide;
  @ViewChild("pdf_viewer") ngPdfViewer;
  @ViewChild("pdf_container") pdfContainer;
  fingerSwipeHeight = 0;
  title = "Büyük Cevşen";

  pageSubscription: Subscription;
  viewGroupSubscription: Subscription;
  zoomSubscription: Subscription;
  showAppRateSubscription: Subscription;
  zoom = 1;
  currentPage: IPdfPage;
  viewGroup: IViewGroup;

  showContentMenu = false;
  showSettingsMenu = false;
  showBookmarkMenu = false;
  showPageInfo = false;

  isNightModeActive = false;
  showAppRate = false;

  constructor(
    private pdfService: PdfService,
    private appRateService: AppRateService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.createSubscriptions();
  }

  createSubscriptions() {
    this.createBackButtonSubscription();
    this.pageSubscription = this.pdfService.getCurrentPage().subscribe(page => {
      if (!!page) {
        if (
          !this.currentPage ||
          page.pageNumber !== this.currentPage.pageNumber
        ) {
          this.onShowPageInfo();
        }
        this.currentPage = page;
        console.log("currentPage:", this.currentPage);
      }
    });
    this.zoomSubscription = this.pdfService
      .getZoomFactor()
      .subscribe(zoomFactor => {
        this.zoom = 1 + zoomFactor / 100;
        this.centralizePdf();
        console.log("zoom:", this.zoom);
      });
    this.viewGroupSubscription = this.pdfService
      .getViewGroup()
      .subscribe(viewGroup => {
        this.viewGroup = viewGroup;
      });

    this.showAppRateSubscription = this.appRateService
      .getShowApprate()
      .subscribe(showModal => {
        this.showAppRate = showModal;
      });
  }

  createBackButtonSubscription() {
    this.platform.backButton.subscribe(res => {
      const isMenuShow = this.checkIsAnyMenuShowAndClose();

      if (!isMenuShow) {
        this.closeApp();
      }
    });
  }

  checkIsAnyMenuShowAndClose(): boolean {
    const isMenuShowing =
      this.showBookmarkMenu || this.showContentMenu || this.showSettingsMenu;

    this.showBookmarkMenu = false;
    this.showContentMenu = false;
    this.showSettingsMenu = false;

    this.setTitle();

    return isMenuShowing;
  }

  closeApp() {
    navigator["app"].exitApp();
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

    if (this.showAppRateSubscription) {
      this.showAppRateSubscription.unsubscribe();
    }
  }

  onToggleContentMenu() {
    this.showContentMenu = !this.showContentMenu;
    if (this.showContentMenu) {
      this.showSettingsMenu = false;
      this.showBookmarkMenu = false;
    }
    this.setTitle();
  }

  onToggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
    if (this.showSettingsMenu) {
      this.showContentMenu = false;
      this.showBookmarkMenu = false;
    }
    this.setTitle();
  }

  onToggleBookmarkMenu() {
    this.showBookmarkMenu = !this.showBookmarkMenu;
    if (this.showBookmarkMenu) {
      this.showContentMenu = false;
      this.showSettingsMenu = false;
    }
    this.setTitle();
  }

  setTitle() {
    if (this.showSettingsMenu) {
      this.title = "Ayarlar";
    } else if (this.showContentMenu) {
      this.title = "İçindekiler";
    } else if (this.showBookmarkMenu) {
      this.title = "Ayraç";
    } else if (!this.showContentMenu) {
      this.title = "Büyük Cevşen";
    }
  }

  pageRendered() {
    this.calculateFingerSwipeHeight();
    this.centralizePdf();
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
    this.setTitle();
  }

  centralizePdf() {
    if (this.ngPdfViewer && this.pdfContainer) {
      const element = this.ngPdfViewer.element.nativeElement.firstChild;
      const scrollLeft =
        element.scrollWidth * (this.zoom - 1) * ScrollLeftFactor;
      const scrollTop = element.scrollHeight * ScrollTopFactor;
      this.pdfContainer.nativeElement.scrollTop = scrollTop;
      this.ngPdfViewer.element.nativeElement.firstChild.scrollLeft = scrollLeft;
    }
  }

  calculateFingerSwipeHeight() {
    if (this.ngPdfViewer) {
      this.fingerSwipeHeight = this.ngPdfViewer.element.nativeElement.firstChild.scrollHeight;
    }
  }

  onShowPageInfo() {
    this.showPageInfo = true;
    setTimeout(() => {
      this.showPageInfo = false;
    }, 500);
  }
}
