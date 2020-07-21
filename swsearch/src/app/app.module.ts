import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component'; 
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

//Componentes
import { SearchGlobalComponent } from 'src/app/components/search-global/search-global.component';
import { InfoMatFavoriteComponent } from 'src/app/components/info-mat-favorite/info-mat-favorite.component';
import { InfoLabSearchComponent } from 'src/app/components/info-lab-search/info-lab-search.component';
import { InfoSubjectSearchComponent } from 'src/app/components/info-subject-search/info-subject-search.component';
import { InfoTeachSearchComponent } from 'src/app/components/info-teach-search/info-teach-search.component';
import { InfoProfileTeachComponent } from 'src/app/components/info-profile-teach/info-profile-teach.component';
import { ShowImgCompleteComponent } from 'src/app/components/show-img-complete/show-img-complete.component';
import { LoadPhotoComponent } from 'src/app/components/load-photo/load-photo.component';
import { UpdateInfoUserComponent } from 'src/app/components/update-info-user/update-info-user.component';
import { OptionsUserComponent } from 'src/app/components/options-user/options-user.component';

//Geolocalizacion
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

//Navegacion
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

//Idioma español
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

//Servicios
import { PersonasService } from '../../src/app/services/personas.service';
import { UsuarioService } from '../../src/app/services/usuario.service';
import { LoadImageService } from '../../src/app/services/load-image.service';

//LocalStorage
import { IonicStorageModule } from '@ionic/storage';
 
//Permitir actiar el GPS
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

//Pipes
import { ImagenPipe } from './pipes/imagen.pipe';
 
//Camera
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

//Firebase
//AngularFirebase
import { AngularFireModule } from '@angular/fire';
import {AngularFireAuthModule } from '@angular/fire/auth';

//AngularFirestore
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from "@angular/fire/storage";

//Lector pdf
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';

 

export const firebaseConfigPro = {
  apiKey: "AIzaSyDXqIG26BWX_urrxGDbXUiYR9JX-ik7mXI",
  authDomain: "app-swsearch.firebaseapp.com",
  databaseURL: "https://app-swsearch.firebaseio.com",
  projectId: "app-swsearch",
  storageBucket: "app-swsearch.appspot.com",
  messagingSenderId: "625699495860",
  appId: "1:625699495860:web:d54fc996898dfc171a9ce1"
};

 
 
@NgModule({
  declarations: [AppComponent,SearchGlobalComponent,InfoMatFavoriteComponent,UpdateInfoUserComponent,OptionsUserComponent,
                 InfoProfileTeachComponent,InfoTeachSearchComponent,InfoSubjectSearchComponent,LoadPhotoComponent,
                 InfoLabSearchComponent, ImagenPipe,ShowImgCompleteComponent],
  entryComponents: [SearchGlobalComponent,InfoMatFavoriteComponent,InfoProfileTeachComponent,LoadPhotoComponent,UpdateInfoUserComponent,
                InfoTeachSearchComponent,InfoSubjectSearchComponent,ShowImgCompleteComponent,InfoLabSearchComponent,OptionsUserComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    FormsModule, 
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfigPro),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    AndroidPermissions,
    LocationAccuracy,
    File,
    PreviewAnyFile,
    ImagePicker,
    PersonasService,
    LoadImageService,
    UsuarioService,
    Geolocation,
    LaunchNavigator,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: LOCALE_ID, useValue:"es" }
  ],  
  bootstrap: [AppComponent]
})
export class AppModule {}
