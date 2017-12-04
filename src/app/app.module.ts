import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { AgmCoreModule } from '@agm/core';

import { PlacesService } from '../services/places';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddPlacePage } from '../pages/add-place/add-place';
import { PlacePage } from '../pages/place/place';
import { SetLocationPage } from '../pages/set-location/set-location';

@NgModule({
    declarations: [MyApp, HomePage, AddPlacePage, PlacePage, SetLocationPage],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB4BuxXgtUV3TOgn_Iip07jG3hMDa5yCqA'
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        AddPlacePage,
        PlacePage,
        SetLocationPage
    ],
    providers: [
        Geolocation,
        Camera,
        File,
        PlacesService,
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule {}
