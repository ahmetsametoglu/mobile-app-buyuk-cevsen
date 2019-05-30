import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PopupZoomComponent } from './components/popup-zoom/popup-zoom.component';
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import { ContentMenuComponent } from './components/content-menu/content-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    PopupZoomComponent,
    SettingsMenuComponent,
    ContentMenuComponent],
  entryComponents: [PopupZoomComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
