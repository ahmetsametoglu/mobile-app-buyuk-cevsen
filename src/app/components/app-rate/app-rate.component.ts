import { Component, OnInit } from '@angular/core';
import { AppRateService } from 'src/app/services/app-rate.service';

@Component({
  selector: 'app-app-rate',
  templateUrl: './app-rate.component.html',
  styleUrls: ['./app-rate.component.scss'],
})
export class AppRateComponent implements OnInit {

  constructor(
    private appRateService: AppRateService
  ) { }

  ngOnInit() { }

  onSendMail() {
    this.appRateService.showMailSender();
  }

  onAskLater() {
    this.appRateService.askLater();

  }

  onGoToStore() {
    this.appRateService.goToStore();
  }

}
