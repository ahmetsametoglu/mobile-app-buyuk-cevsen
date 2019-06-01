import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import pdfInfo from '../../assets/data/pdf-content.json';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private currentPage: BehaviorSubject<IPdfPage> = new BehaviorSubject(null);
  private viewGroup: BehaviorSubject<string> = new BehaviorSubject(null);
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

    this.storage.get('viewGroup').then((val) => {
      if (!!val) {
        this.viewGroup.next(val);
      } else {
        this.viewGroup.next('am');
      }
    });
  }

  beforePage(currentPage: IPdfPage) {
    if (currentPage.pageIndex <= 0) {
      const firstPage = pdfInfo.pages[0];
      this.setCurrentPage(firstPage);
    } else {

      const viewGroup = this.viewGroup.value;
      let beforePage = null;

      if (viewGroup === 'am') {
        beforePage = pdfInfo.pages[currentPage.pageIndex - 1];
      } else {
        const beforePages = pdfInfo.pages.slice(0, currentPage.pageIndex).reverse();
        beforePage = beforePages.find(p => p.pageIndex < currentPage.pageIndex && p.group === viewGroup);
      }

      this.setCurrentPage(beforePage);
    }
  }

  nextPage(currentPage: IPdfPage) {
    if (currentPage.pageIndex >= pdfInfo.pageCount - 1) {
      const lastPage = pdfInfo.pages[pdfInfo.pageCount - 1];
      this.setCurrentPage(lastPage);
    } else {
      const viewGroup = this.viewGroup.value;
      let nextPage = null;

      if (viewGroup === 'am') {
        nextPage = pdfInfo.pages[currentPage.pageIndex + 1];
      } else {
        const nextPages = pdfInfo.pages.slice(currentPage.pageIndex, pdfInfo.pages.length);
        nextPage = nextPages.find(p => p.pageIndex > currentPage.pageIndex && p.group === viewGroup);
      }

      this.setCurrentPage(nextPage);
    }
  }


  setCurrentPage(v: IPdfPage) {
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

  getContentPages() {
    return pdfInfo.pages.filter(p => p.showOnContentMenu);
  }

  setViewGroup(viewGroup: string) {
    this.storage.set('viewGroup', viewGroup);
    if (viewGroup !== 'am' && this.currentPage.value.group !== 'am' && viewGroup !== this.currentPage.value.group) {
      if (viewGroup === 'm') {
        this.currentPage.next(pdfInfo.pages[this.currentPage.value.pageIndex + 1]);
      } else if (viewGroup === 'a') {
        this.currentPage.next(pdfInfo.pages[this.currentPage.value.pageIndex - 1]);
      }
    }
    this.viewGroup.next(viewGroup);
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

export interface IViewGroup {
  name: ViewGroupName;
  navSide: NavigationSide;
}

export enum ViewGroupName {
  arapca = 'a',
  meal = 'm',
  arapca_meal = 'am'
}
export enum NavigationSide {
  left,
  right
}

