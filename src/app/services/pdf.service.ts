import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import pdfInfo from '../../assets/data/pdf-content.json';
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private currentPage: BehaviorSubject<IPdfPage> = new BehaviorSubject(null);
  private zoomFactor: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() {
    const initialPage = pdfInfo.pages[0];
    this.currentPage.next(initialPage);
  }

  beforePage(currentPage: IPdfPage) {
    if (currentPage.pageIndex <= 0) {
      this.currentPage.next(pdfInfo.pages[0]);
    } else {
      this.currentPage.next(pdfInfo.pages[currentPage.pageIndex - 1]);
    }
  }

  nextPage(currentPage: IPdfPage) {
    if (currentPage.pageIndex >= pdfInfo.pageCount - 1) {
      this.currentPage.next(pdfInfo.pages[pdfInfo.pageCount - 1]);
    } else {
      this.currentPage.next(pdfInfo.pages[currentPage.pageIndex + 1]);
    }
  }

  scaleZoomFactor(scale: number) {
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

