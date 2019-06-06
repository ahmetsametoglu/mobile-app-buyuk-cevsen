import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppRateService {
  private showAppRate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
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
        return true;
      } else {
        return false;
      }
    }
  }

  getShowApprate() {
    return this.showAppRate.asObservable();
  }
}
