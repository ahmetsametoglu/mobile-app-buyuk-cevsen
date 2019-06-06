import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { IPdfPage, PdfService, ViewGroupName, NavigationSide } from 'src/app/services/pdf.service';
import { Subscription } from 'rxjs';
import { AppRateService } from 'src/app/services/app-rate.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit, OnDestroy {

  @Output() closeMenu = new EventEmitter();
  @Output() changeNightViewMode = new EventEmitter<boolean>();
  @Input() isNightModeActive: boolean;

  pageSubscription: Subscription;
  currentPage: IPdfPage;
  viewGroupName: ViewGroupName;
  navigationSide: NavigationSide;


  constructor(
    private pdfService: PdfService,
    private apprateService: AppRateService,
  ) { }

  ngOnInit() {
    this.pageSubscription = this.pdfService.getCurrentPage().subscribe(page => {
      if (!!page) {
        this.currentPage = page;
      }
    });

    this.pageSubscription = this.pdfService.getViewGroup().subscribe(viewGroup => {
      if (!!viewGroup) {
        console.log(viewGroup);
        this.viewGroupName = viewGroup.name;
        this.navigationSide = viewGroup.navSide;
      }
    });

  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

  changeViewGroup(event) {
    this.viewGroupName = event.detail.value;
    this.pdfService.setViewGroup(this.viewGroupName);
  }

  onNavigateOtherAppPage() {
    window.open('https://play.google.com/store/apps/developer?id=Yaman+%C5%9Eehzade', '_system');
  }

  showMailSender() {
    this.apprateService.showMailSender();
  }

  onCloseMenu() {
    this.closeMenu.emit(true);
  }

  changeNavSide(event) {
    this.navigationSide = event.detail.value;
    this.pdfService.saveNavSide(this.viewGroupName, this.navigationSide);
  }

  onChangeNightViewMode(event) {
    const isNightViewActive = event.detail.checked;
    this.changeNightViewMode.emit(isNightViewActive);
  }

}
