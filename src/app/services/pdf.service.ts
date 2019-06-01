import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import pdfInfo from '../../assets/data/pdf-content.json';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private currentPage: BehaviorSubject<IPdfPage> = new BehaviorSubject(null);
  private viewGroup: BehaviorSubject<IViewGroup> = new BehaviorSubject(null);
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
        const defaultViewGroup = { name: ViewGroupName.arapca_meal, navSide: NavigationSide.right } as IViewGroup;
        this.viewGroup.next(defaultViewGroup);
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

      if (viewGroup.name === ViewGroupName.arapca_meal) {
        beforePage = pdfInfo.pages[currentPage.pageIndex - 1];
      } else {
        const beforePages = pdfInfo.pages.slice(0, currentPage.pageIndex).reverse();
        beforePage = beforePages.find(p => p.pageIndex < currentPage.pageIndex && p.group === viewGroup.name);
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

      if (viewGroup.name === ViewGroupName.arapca_meal) {
        nextPage = pdfInfo.pages[currentPage.pageIndex + 1];
      } else {
        const nextPages = pdfInfo.pages.slice(currentPage.pageIndex, pdfInfo.pages.length);
        nextPage = nextPages.find(p => p.pageIndex > currentPage.pageIndex && p.group === viewGroup.name);
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

  getViewGroup() {
    return this.viewGroup.asObservable();
  }

  getZoomFactor() {
    return this.zoomFactor.asObservable();
  }

  getContentPages() {
    return pdfInfo.pages.filter(p => p.showOnContentMenu);
  }

  async setViewGroup(viewGroupName: ViewGroupName) {
    const currentPage = this.currentPage.value;
    let viewGroup: IViewGroup = null;

    const viewGroups = await this.storage.get('ViewGroups') as IViewGroup[] || [];
    const index = viewGroups.findIndex(v => v.name === viewGroupName);
    viewGroup = index !== -1 ? viewGroups[index] :
      { name: viewGroupName, navSide: this.getDefaultNavSide(viewGroupName) };


    this.storage.set('viewGroup', viewGroup);
    if (viewGroup.name !== ViewGroupName.arapca_meal && currentPage.group !== ViewGroupName.arapca_meal && viewGroup.name !== currentPage.group) {
      if (viewGroup.name === ViewGroupName.meal) {
        this.currentPage.next(pdfInfo.pages[this.currentPage.value.pageIndex + 1]);
      } else if (viewGroup.name === ViewGroupName.arapca) {
        this.currentPage.next(pdfInfo.pages[this.currentPage.value.pageIndex - 1]);
      }
    }
    this.viewGroup.next(viewGroup);
    this.storage.set('viewGroup', viewGroup);
    this.updateViewGroups(viewGroup);
  }

  saveNavSide(viewGroupName: ViewGroupName, navSide: NavigationSide) {
    const viewGroup = { name: viewGroupName, navSide };
    this.viewGroup.next(viewGroup);
    this.storage.set('viewGroup', viewGroup);
    this.updateViewGroups(viewGroup);
  }

  private updateViewGroups(viewGroup: IViewGroup) {

    this.storage.get('ViewGroups').then((result: IViewGroup[]) => {
      console.log('ViewGroups:', result);

      if (!result) {
        result = [];
      }

      const index = result.findIndex(x => x.name === viewGroup.name);

      if (index === -1) {
        result.push(viewGroup);
      } else {
        result[index].navSide = viewGroup.navSide;
      }

      this.storage.set('ViewGroups', result);
    });
  }

  private getDefaultNavSide(viewGroupName: ViewGroupName) {
    let navSide = null;

    switch (viewGroupName) {
      case ViewGroupName.arapca:
        navSide = NavigationSide.left
        break;
      case ViewGroupName.meal:
        navSide = NavigationSide.right
        break;
      case ViewGroupName.arapca_meal:
        navSide = NavigationSide.left
        break;

      default:
        navSide = NavigationSide.right
        break;
    }

    return navSide;
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
  left = 'left',
  right = 'right'
}

