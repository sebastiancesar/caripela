import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {RoundProgressModule} from 'angular-svg-round-progressbar';

import { MyApp } from './app.component';  
import { LandingPage } from '../pages/landing/landing';
import { SamplerPage } from '../pages/sampler/sampler';
import { TrainingPage } from '../pages/training/training';
import { PlayPage } from '../pages/play/play';
import { CameraPreview } from '../modules/preview/preview';
import { CaptureBrowserService } from '../modules/capture/captureBrowser';
import { GameManager } from '../modules/game/gameManager';
import { FinalCountdown } from '../modules/widgets/countdown';


@NgModule({
  declarations: [
    MyApp,
    CameraPreview,
    LandingPage,
    SamplerPage,
    PlayPage,
    TrainingPage,
    FinalCountdown
  ],
  imports: [
    BrowserModule,
    RoundProgressModule,    
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,    
    LandingPage,
    SamplerPage,
    PlayPage,
    TrainingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CaptureBrowserService,
    GameManager,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
