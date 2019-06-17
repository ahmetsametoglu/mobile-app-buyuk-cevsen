import { Component, OnInit, OnDestroy } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';
import { take } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { IBookmark } from 'src/app/models/bookmark.model';
import { Subscription } from 'rxjs';
import { resolve } from 'q';
@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss'],
})
export class BookmarkComponent implements OnInit, OnDestroy {

  bookmarks: IBookmark[] = [];
  bookmarksSubscription: Subscription;

  constructor(
    private pdfService: PdfService,
    public alertController: AlertController,
    public toastController: ToastController,
    private bookmarkService: BookmarkService,
  ) { }

  ngOnInit() {
    this.bookmarksSubscription = this.bookmarkService.getBookmarks().subscribe(bookmarks => {
      this.bookmarks = bookmarks;
    })
  }

  ngOnDestroy() {
    if (this.bookmarksSubscription) {
      this.bookmarksSubscription.unsubscribe();
    }
  }

  async addBookmark() {
    const currentPage = await this.pdfService.getCurrentPage().pipe(take(1)).toPromise();
    console.log('currentPage:', currentPage);

    const name = await this.showInputAlert(`${currentPage.pageNumber}. sayfaya ayraç ekle `);
    console.log(name);
    const bookmark: IBookmark = {
      id: null,
      name,
      pageNumber: currentPage.pageNumber,
      description: currentPage.description,
    }
    this.bookmarkService.saveUpdateBookmark(bookmark);
  }

  async showInputAlert(header: string): Promise<string> {


    return new Promise(async resolve => {
      const alert = await this.alertController.create({
        header: header,
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
            text: 'Ekle',
            handler: (data) => {
              console.log('Confirm Ok', data);
              const name = data.name.trim();
              if (name !== '') {
                resolve(name)
              } else {
                this.showAttention();
              }
            }
          }
        ]
      });

      await alert.present();
    })
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
