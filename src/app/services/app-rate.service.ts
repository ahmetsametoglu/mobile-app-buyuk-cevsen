import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { AppRateComponent } from '../components/app-rate/app-rate.component';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {

  constructor(
    private storage: Storage,
    private modalController: ModalController
  ) { }

  checkAppRate() {
    this.storage.get('show_apprate').then(show => {
      console.log('show_apprate', show);
      if (show === null) {
        show = true;
        this.storage.set('show_apprate', true);
      }

      if (show) {
        this.storage.get('rate_countdown').then(countdown => {
          console.log('countdown:', countdown);
          if (countdown === null) {
            countdown = 4;
          } else if (countdown >= 0) {
            countdown--;
          }
          if (countdown <= 0) {
            this.showAppRateModal();
          }
          this.storage.set('rate_countdown', countdown);
        });
      }
    });
  }

  async showAppRateModal() {
    let modal = await this.modalController.create({ component: AppRateComponent });
    modal.present();
  }
}
