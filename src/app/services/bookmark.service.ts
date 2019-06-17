import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IBookmark } from '../models/bookmark.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
    private bookmarks: IBookmark[] = [];
    private bookmarkSubject: BehaviorSubject<IBookmark[]> = new BehaviorSubject(this.bookmarks);

    constructor(private storage: Storage) {
        this.initStorage();
    }

    private initStorage() {
        this.storage.get('bookmarks').then(bookmarks => {
            if (!bookmarks) {
                this.bookmarks = bookmarks;
            }
        });
    }

    private saveBookmarks() {
        this.storage.set('bookmarks', this.bookmarks);
    }

    private getCreateBookMarkId(length) {
        const id = 'xxxxxxxxxxxxxxxxyxxxyxxxxyxx'.replace(/[xy]/g, c => {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        return !!length ? id.substring(0, length) : id;
    }

    saveUpdateBookmark(bookmark: IBookmark) {
        if (!bookmark.id) {
            bookmark.id = this.getCreateBookMarkId(10);
            this.bookmarks.push(bookmark);
            this.saveBookmarks();

        } else {
            const index = this.bookmarks.findIndex(b => b.id === bookmark.id);
            if (index !== -1) {
                this.bookmarks[index] = bookmark;
                this.saveBookmarks();
            }
        }
    }

    getBookmarks() {
        return this.bookmarkSubject.asObservable();
    }

}