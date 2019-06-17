import { Component, OnInit } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';
import { take } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss'],
})
export class BookmarkComponent implements OnInit {

  constructor(
    private pdfService: PdfService,
    public alertController: AlertController,
    public toastController: ToastController,
  ) { }

  ngOnInit() { }

  async addBookmark() {
    const currentPage = await this.pdfService.getCurrentPage().pipe(take(1)).toPromise();
    console.log('currentPage:', currentPage);

    const alert = await this.alertController.create({
      header: `${currentPage.pageNumber}. sayfaya ayraç ekle `,
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'ayraça bir isim veriniz'
        }
      ],
      buttons: [
        {
          text: 'Iptal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Tamam',
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data.name.trim() !== '') {

            } else {
              this.showAttention();
            }
          }
        }
      ]
    });

    await alert.present();

  }

  async showAttention() {
    const toast = await this.toastController.create({
      message: 'Kutucuğu boş bırakamazsınız',
      duration: 2000
    });
    toast.present();
    toast.onDidDismiss()
  }

}
