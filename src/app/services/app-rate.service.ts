import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {
  private showAppRate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private emailComposer: EmailComposer
  ) { }

  async checkAppRate() {
    let show = await this.storage.get('show_apprate');
    console.log('show_apprate', show);
    if (show === null) {
      show = true;
      this.storage.set('show_apprate', true);
    }

    if (show) {
      let countdown = await this.storage.get('rate_countdown');
      console.log('countdown:', countdown);
      if (countdown === null) {
        countdown = 4;
      } else if (countdown >= 0) {
        countdown--;
      }
      this.storage.set('rate_countdown', countdown);

      if (countdown <= 0) {
        this.showAppRate.next(true);
      } else {
        this.showAppRate.next(false);
      }
    }
  }

  getShowApprate() {
    return this.showAppRate.asObservable();
  }

  showMailSender() {
    this.askLater();
    this.emailComposer.open({
      to: 'yamansehzade@gmail.com',
      subject: 'Büyük Cevşen'
    });
  }

  goToStore() {
    try {
      this.storage.set('show_apprate', false);
      this.showAppRate.next(false);
      window.open('https://play.google.com/store/apps/details?id=buyuk.cevsen.ve.meali', '_system');
    } catch (error) {
      console.error(error);
    }
  }

  askLater() {
    this.storage.set('rate_countdown', 10);
    this.showAppRate.next(false);
  }
}
