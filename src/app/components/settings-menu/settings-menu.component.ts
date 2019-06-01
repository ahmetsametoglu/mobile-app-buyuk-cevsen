import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IPdfPage, PdfService } from 'src/app/services/pdf.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit, OnDestroy {

  @Output() closeMenu = new EventEmitter();

  viewGroup = 'am';
  pageSubscription: Subscription;
  currentPage: IPdfPage;


  constructor(private pdfService: PdfService) { }

  ngOnInit() {
    this.pageSubscription = this.pdfService.getCurrentPage().subscribe(page => {
      if (!!page) {
        this.currentPage = page;
      }
    });

  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

  changeViewGroup(event) {
    this.viewGroup = event.detail.value;
    this.pdfService.setViewGroup(this.viewGroup);
  }

  onNavigateOtherAppPage() {

  }

  showMailSender() {

  }

  onCloseMenu() {
    this.closeMenu.emit(true);
  }

}
