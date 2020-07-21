import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
//Navegar con google
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { ShowImgCompleteComponent } from '../show-img-complete/show-img-complete.component';
import { URL_IMAGENES } from '../../../config/url.servicios';
import { UiServiceService } from '../../services/ui-service.service';

//Acceder al GPS del movil
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
 

@Component({
  selector: 'app-info-mat-favorite',
  templateUrl: './info-mat-favorite.component.html',
  styleUrls: ['./info-mat-favorite.component.scss'],
})
export class InfoMatFavoriteComponent implements OnInit {

  //listAulas: any[] = [];
  listAulas: any[] = [];
  sendJSON: any[] = [];

  titulo:string;
  
  //Coordenadas
  destination2: string;
  start2: string;
  public zoom: number;
  latStart: number;
  lonStart: number;
 


  constructor(

    public modalCt: ModalController,
    public alertCtrl: AlertController,
    private launchNavigator: LaunchNavigator,
    public _ui:UiServiceService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation

  ) {    
    this.setCurrentPosition();
   }
   
  ngOnInit() {}

  closeModal() {
    this.modalCt.dismiss();
  }//Fin closeModal()

  
  async openAllImg(detalle:string,nameImg:string){

       //Reinicio
     this.sendJSON = [];
    
     //Envio    
     this.sendJSON.push({
      "nombre": nameImg,
      "detalle": detalle       
    });
 
    const alert = await this.alertCtrl.create({
      subHeader: detalle,
      message: '<div style="height: 280px;"><img style="height: 100%;" src="'+URL_IMAGENES+nameImg+'"></div>',
      cssClass: 'alertCancel',
      buttons: [
         {
          text: '[Pantalla completa]',
          handler: () => {            
            this.openModal(this.sendJSON);
          }
        }
      ]       
    });

    await alert.present();

  }//Fin openAllImg()

  async openModal(JSON:any){

    const modal = await this.modalCt.create({
      component: ShowImgCompleteComponent,
      componentProps: {
         imgRoute:JSON          
      }
    });
    return await modal.present(); 

  }//Fin openModal()

  //NAVEGACION CON GOOGLE MAPS

  async goToAddress(lat: string, lon: string, aula: string) {

   await this.setCurrentPosition();

       //Si las coordenadas son undefined    
       if ((this.latStart == null) || (this.latStart === undefined)) {   
        //await this._ui.toastInformative("Activa el GPS! sdf"+this.latiStart);
        await this.checkGPSPermission();
        await this.setCurrentPosition();
        this._ui.toastInformative("Intentalo nuevamente!");
        return;
      }

    const alert = await this.alertCtrl.create({
      header: 'Iniciar navegación...',
      message: '<div style="font-size: 16px;" padding-bottom: 0px !important;"><p style="font-size: 14px; margin-top: 0px;"> ¿Desea iniciar ruta a: <b>' + aula + '</b> ?</div>',

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cssBotonCancelarll',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Aceptar',
          role: 'ok',
          cssClass: 'cssBotonOkll',
          handler: () => {
            this.navigate(lat, lon);
          }


        }

      ]
    });

    await alert.present();

  }//Fin gotoAddres()

  //Inicio Mapa de Google en ruta

  async navigate(lat: string, lon: string) {

    this.start2 = `${this.latStart},${this.lonStart}`;
    this.destination2 = `${lat},${lon}`;


    let options: LaunchNavigatorOptions = {
      start: this.start2,
      app: this.launchNavigator.APP.GOOGLE_MAPS

    };

    await this.launchNavigator.navigate(this.destination2, options)
      .then(
        success => alert('Exito'),
        error => alert('Error al iniciar: ' + error)
      );
  }//Fin Mapa de Google en ruta

   //Posicion actual
   public async setCurrentPosition() {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latStart = resp.coords.latitude;
      this.lonStart = resp.coords.longitude;   
     
    }).catch((error) => {
      console.log('Error getting location' + error);
    });

  }//Fin setCurrentPosition()


  ionViewWillLeave(): void {   
   // alert("Vamos a cerrar la foto");
    this.alertCtrl.dismiss();
    
  }//ionViewWillLeave()

  
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
      async () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        await this.setCurrentPosition();        
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



}//Fin del programa
