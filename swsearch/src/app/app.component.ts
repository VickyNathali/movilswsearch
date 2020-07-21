import { Component, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Platform, NavController, AlertController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UsuarioService } from './services/usuario.service';

//Acceder al GPS del movil
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
   

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _us: UsuarioService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private storage: Storage,
    public router: Router,
    public alertController: AlertController,
    private toastController: ToastController
  ) {
    this.initializeApp();
 
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.checkGPSPermission();
      this.statusBar.backgroundColorByHexString('#08245D');
      this.splashScreen.hide();
       
    });
  }//Fin initializeApp() 

  ngOnInit(){
    this.verificarToken();
    this.checkConnection();
  }//Fin ngOnInit()

  async verificarToken() {
    const us = await (this.storage.get('id_usuario'));    
    const rr = await this._us.getInfoUser(us);
    const red = this._us.userInfo.length;
   
    if ((us == null) || (us === '') || (us === undefined) || (red == 0)) {
      await this.router.navigateByUrl('/login');
      //await this.storage.clear();
    } else {
      const v = await (this.storage.get('user'));
      var carrera = v[0].NOMBRE_CAR;
      var usuario = v[0].NOMBRES_PER;
      await this.router.navigate(['/home', carrera, usuario]);
    }

  }//Fin verificaToken()
 
  //Inicio Permtir acceder al GPs del Movil
  //Check if application having GPS access permission  
  async checkGPSPermission() {
    await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
         
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        console.log(err);
      }
    );
  }//Fin checkGPSPermission()

  //Encender el GPS, sin salir de la app
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        console.log("Todo bien se activo el gps");
        
      },
      error => console.log('Error requesting location permissions ' + JSON.stringify(error))
      );
    }//Fin askToTurnOnGPS()
    
    requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          console.log("4");
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                // call method to turn on GPS
                this.askToTurnOnGPS();
              },
              error => {
                //Show alert if user click on 'No Thanks'
                console.log('requestPermission Error requesting location permissions ' + error)
              }
            );
        }
      });
    }//Fin requestGPSPermission()
    //Fin permitir acceder al GPS del Movil
 
  checkConnection(){
    if (navigator.onLine) {
       console.log('Internet is connected!');
      
   } else {
      console.log('No internet connection');
      this.toastError('Verificando...');
   }
  }//Fin checkConnection()

  async toastError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'middle',
      cssClass: 'toast-wrapper-error',
      buttons: [{side: 'start',role: 'cancel',icon: 'close-circle',handler: () => {
        this.toastError(message);
      }}],
    });
    toast.present();
  }//Fin toastError()

 

}//Fin programa
