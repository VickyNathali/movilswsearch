import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';

//Navegar con google
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { InfoProfileTeachComponent } from '../info-profile-teach/info-profile-teach.component';
import { UiServiceService } from 'src/app/services/ui-service.service';

//Acceder al GPS del movil
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-info-teach-search',
  templateUrl: './info-teach-search.component.html',
  styleUrls: ['./info-teach-search.component.scss'],
})
export class InfoTeachSearchComponent implements OnInit {

  teacherFind: any[] = [];
  sendJSON: any[] = [];

  title: string;

  //Navegacion
  //Coordenadas
  destination2: string;
  start2: string;
  public zoom: number;
  latStart: number;
  lonStart: number;

  //Clasificar por dias
  days: any[] = [];
  daysNoRepeat: any[] = [];
  ordenDaysClass: any[] = [];
  public loading: any;

  constructor(

    public modalC: ModalController,
    private launchNavigator: LaunchNavigator,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public _ui:UiServiceService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation

  ) {
     
  }

  ngOnInit() { this.justDays(); }

  async goToProfile(teacher: any) {
    await this.mostrarCargando('Cargando...');
    //Reinicio
    this.sendJSON = [];

    //Envio
    this.sendJSON.push(teacher);

    const modal = await this.modalC.create({
      component: InfoProfileTeachComponent,
      componentProps: {
        profileTeac: this.sendJSON,
        title: this.title
      }
    });
    this.loading.dismiss();
    return await modal.present();

  }//Fin goToProfile()


  closeModal() {
    this.modalC.dismiss();
  }//Fin closeModal()

  async goToClassNavigate(lat: string, lon: string, aula: string) {

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

  }//fin goToClassNavigate()

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

  async mostrarCargando(mensaje: string) {

    this.loading = await this.loadingController.create({
      message: mensaje,
      animated: true,
      translucent: true,
      mode: 'ios',
      spinner: 'bubbles',
      cssClass: 'spinner-personalizado'
    });

    return this.loading.present();
  }//Fin mostrarCargando()

  //Tratamiento
  justDays() {
    this.days = [];
    this.daysNoRepeat = [];
    this.ordenDaysClass = [];

    for (let i = 0; i < this.teacherFind.length; i++) {

      this.days.push(this.teacherFind[i].DESCRIPCION_DIA);

    }

    this.daysNoRepeat = this.days.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);


    //Push en los dias encontrados

    for (let j = 0; j < this.daysNoRepeat.length; j++) {
      for (let i = 0; i < this.teacherFind.length; i++) {
        if (this.teacherFind[i].DESCRIPCION_DIA === this.daysNoRepeat[j]) {

          this.ordenDaysClass.push(this.teacherFind[i]);

        }
      }
    }



  }//Fin justDays

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

    ionViewWillLeave(): void {   
      // alert("Vamos a cerrar la foto");
       this.alertCtrl.dismiss();
       
     }//ionViewWillLeave()

}//Fin del programa
