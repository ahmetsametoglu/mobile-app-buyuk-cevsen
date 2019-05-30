import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import pdfInfo from '../../assets/data/pdf-content.json';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private currentPage: BehaviorSubject<IPdfPage> = new BehaviorSubject(null);
  private zoomFactor: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private storage: Storage) {

    this.storage.get('lastPageNumber').then((val) => {
      if (!!val) {
        const lastPage = pdfInfo.pages.find(p => p.pageNumber === Number(val));
        this.currentPage.next(lastPage);
      } else {
        const initialPage = pdfInfo.pages[0];
        this.currentPage.next(initialPage);
      }
    });

    this.storage.get('zoomFactor').then((val) => {
      if (!!val) {
        this.zoomFactor.next(val);
      }
    });
  }

  beforePage(currentPage: IPdfPage) {
    if (currentPage.pageIndex <= 0) {
      this.setCurrentPage(pdfInfo.pages[0]);
    } else {
      this.setCurrentPage(pdfInfo.pages[currentPage.pageIndex - 1]);
    }
  }

  nextPage(currentPage: IPdfPage) {
    if (currentPage.pageIndex >= pdfInfo.pageCount - 1) {
      this.setCurrentPage(pdfInfo.pages[pdfInfo.pageCount - 1]);
    } else {
      this.setCurrentPage(pdfInfo.pages[currentPage.pageIndex + 1]);
    }
  }


  private setCurrentPage(v: IPdfPage) {
    this.currentPage.next(v);
    this.storage.set('lastPageNumber', v.pageNumber);
  }

  setZoomFactor(v: number) {
    this.zoomFactor.next(v);
    this.storage.set('zoomFactor', v);
  }

  scaleZoomFactor(scale: number) {
    let newFactor = this.zoomFactor.value + (this.zoomFactor.value * (scale - 1) * 0.2);
    newFactor = newFactor < 1 ? 1 : newFactor;
    newFactor = newFactor > 35 ? 35 : newFactor;
    this.setZoomFactor(newFactor);
  }

  getCurrentPage() {
    return this.currentPage.asObservable();
  }

  getZoomFactor() {
    return this.zoomFactor.asObservable();
  }

}

export interface IPdfPage {
  pageIndex: number;
  pageNumber: number;
  contentTitle: string;
  description: string;
  showOnContentMenu: boolean;
  group: string;
}

