import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { PdfService } from "src/app/services/pdf.service";
import { take } from "rxjs/operators";
import { AlertController, ToastController } from "@ionic/angular";
import { BookmarkService } from "src/app/services/bookmark.service";
import { IBookmark } from "src/app/models/bookmark.model";
import { Subscription } from "rxjs";
@Component({
  selector: "app-bookmark",
  templateUrl: "./bookmark.component.html",
  styleUrls: ["./bookmark.component.scss"]
})
export class BookmarkComponent implements OnInit, OnDestroy {
  @Output() closeMenu = new EventEmitter();
  bookmarks: IBookmark[] = [];
  bookmarksSubscription: Subscription;

  constructor(
    private pdfService: PdfService,
    public alertController: AlertController,
    public toastController: ToastController,
    private bookmarkService: BookmarkService
  ) {}

  ngOnInit() {
    this.bookmarksSubscription = this.bookmarkService
      .getBookmarks()
      .subscribe(bookmarks => {
        console.log(bookmarks);
        this.bookmarks = bookmarks;
      });
  }

  ngOnDestroy() {
    if (this.bookmarksSubscription) {
      this.bookmarksSubscription.unsubscribe();
    }
  }

  goToPage(bookmark: IBookmark) {
    this.pdfService.setCurrentPageWithPageNumber(bookmark.pageNumber);
    this.closeMenu.emit();
  }

  async updateBookmark(bookmark: IBookmark) {
    const currentPage = await this.pdfService
      .getCurrentPage()
      .pipe(take(1))
      .toPromise();

    this.showConfirmation(
      "Ayraç Güncelle",
      `${bookmark.name}`,
      `${currentPage.pageNumber}.sayfaya al`
    ).then(_ => {
      const updatedBookmark = {
        ...bookmark,
        pageNumber: currentPage.pageNumber,
        description: currentPage.description
      };

      if (currentPage.pageNumber !== bookmark.pageNumber) {
        this.bookmarkService.saveUpdateBookmark(updatedBookmark);
      }
    });
  }

  deleteBookmark(bookmark: IBookmark) {
    this.showConfirmation("Ayraç Sil", `${bookmark.name}`, null).then(_ => {
      this.bookmarkService.deleteBookmark(bookmark.id);
    });
  }

  async addBookmark() {
    const currentPage = await this.pdfService
      .getCurrentPage()
      .pipe(take(1))
      .toPromise();

    const name = (await this.showInputAlert(
      `${currentPage.pageNumber}. sayfaya ayraç ekle `
    )) as string;
    console.log(name);
    const bookmark: IBookmark = {
      id: null,
      name,
      pageNumber: currentPage.pageNumber,
      description: currentPage.description
    };
    this.bookmarkService.saveUpdateBookmark(bookmark);
  }

  async showInputAlert(header: string) {
    return new Promise(async resolve => {
      const alert = await this.alertController.create({
        header: header,
        backdropDismiss: false,
        inputs: [
          {
            name: "name",
            type: "text",
            placeholder: "ayraça bir isim veriniz"
          }
        ],
        buttons: [
          {
            text: "Iptal",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm Cancel");
            }
          },
          {
            text: "Ekle",
            handler: data => {
              console.log("Confirm Ok", data);
              const name = data.name.trim();
              if (name !== "") {
                resolve(name);
              } else {
                this.showAttention();
              }
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async showAttention() {
    const toast = await this.toastController.create({
      message: "Kutucuğu boş bırakamazsınız",
      duration: 2000
    });
    toast.present();
    toast.onDidDismiss();
  }

  async showConfirmation(header: string, subHeader: string, message: string) {
    return new Promise(async resolve => {
      const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: [
          {
            text: "Iptal",
            role: "cancel",
            cssClass: "danger"
          },
          {
            text: "Tamam",
            handler: () => {
              resolve();
            }
          }
        ]
      });

      await alert.present();
    });
  }
}
