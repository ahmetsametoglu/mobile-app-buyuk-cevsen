import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HomePage } from './home.page';
import { ContentMenuComponent } from 'src/app/components/content-menu/content-menu.component';
import { SettingsMenuComponent } from 'src/app/components/settings-menu/settings-menu.component';
import { PageZoomComponent } from 'src/app/components/page-zoom/page-zoom.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PdfViewerModule
  ],
  declarations: [
    HomePage,
    SettingsMenuComponent,
    ContentMenuComponent,
    PageZoomComponent
  ]
})
export class HomePageModule { }
