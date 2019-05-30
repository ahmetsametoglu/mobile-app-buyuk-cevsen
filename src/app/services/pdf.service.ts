import { Injectable } from '@angular/core';
import pdfInfo from '../../assets/data/pdf-content.json';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {
    console.log(pdfInfo);
  }
}
