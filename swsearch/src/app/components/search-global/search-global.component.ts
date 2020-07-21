import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { PersonasService } from '../../services/personas.service';

//Navegar con google
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

import { InfoLabSearchComponent } from '../info-lab-search/info-lab-search.component';
import { InfoSubjectSearchComponent } from '../info-subject-search/info-subject-search.component';
import { InfoTeachSearchComponent } from '../info-teach-search/info-teach-search.component';
import { ShowImgCompleteComponent } from '../show-img-complete/show-img-complete.component';
import { async } from '@angular/core/testing';
import { UiServiceService } from 'src/app/services/ui-service.service';

//Acceder al GPS del movil
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-search-global',
  templateUrl: './search-global.component.html',
  styleUrls: ['./search-global.component.scss'],
})
export class SearchGlobalComponent implements OnInit {

  //A buscar

  textoBuscar: string;
  buscando = true;

  titulo: string;
  public loading: any;

  logoSearch = "assets/imgs/buscar.png";
  showLogo: boolean = false;

  //Navegacion
  //Coordenadas
  destination2: string;
  start2: string;
  public zoom: number;
  latiStart: number;
  longStart: number;

  sendJSON: any[] = [];

  //Validaciones
  edf: string;


  constructor(

    public modalCtrl: ModalController,
    public _ps: PersonasService,
    private launchNavigator: LaunchNavigator,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public _ui:UiServiceService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation

  ) {

    //this.setCurrentPosition();
  }

  ngOnInit() {
    this.showLogo = true;
  }

  async search(event) {

    const ree: string = event.detail.value;
    const re = ree.toLowerCase();
    const valor = await this.reemplazarAcentos(re);

    if (valor.length === 0 || valor === '' || valor === undefined || valor === null) {

      this.buscando = true;
    } else {

      this.showLogo = false;
      await this._ps.searchJustClass(valor);
      await this._ps.searchJustSubjects(valor);
      const valor1 = await this.reemplazarAcentosEspacio(re);
      await this._ps.searchJustTeachers(valor1);

    }
  }//fin search()

  closeModal() {
    this.modalCtrl.dismiss();
  }//Fin closeModal()

  async goToClassNavigate(lat: string, lon: string, aula: string) {
     
    await this.setCurrentPosition();      

       //Si las coordenadas son undefined    
   if ((this.latiStart == null) || (this.latiStart === undefined)) {   
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

  }//Fin goToClassNavigate()

  ionViewWillLeave(): void {   
    // alert("Vamos a cerrar la foto");
     this.alertCtrl.dismiss();
     
   }//ionViewWillLeave()

  //Inicio Mapa de Google en ruta
  async navigate(lat: string, lon: string) {

    this.start2 = `${this.latiStart},${this.longStart}`;
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
      this.latiStart = resp.coords.latitude;
      this.longStart = resp.coords.longitude;   
     
    }).catch((error) => {
      console.log('Error getting location' + error);
    });

  }//Fin setCurrentPosition()

  async goToLaboratory(item, n) {
    await this.mostrarCargando('Cargando...');
    await this._ps.allClassWithCode(item);

    const modal = await this.modalCtrl.create({
      component: InfoLabSearchComponent,
      componentProps: {
        classFind: this._ps.everyClassCode,
        title: this.titulo
      }
    });
    this.loading.dismiss();
    return await modal.present();

  }//Fin goToLaboratory()

  async goToSubject(item) {
    await this.mostrarCargando('Cargando...');
    await this._ps.allSubjectsWithCode(item);

    const modal = await this.modalCtrl.create({
      component: InfoSubjectSearchComponent,
      componentProps: {
        subjectFind: this._ps.everySubjectsCode,
        title: this.titulo
      }
    });
    this.loading.dismiss();
    return await modal.present();

  }//Fin goToSubject(item)

  async goToTeacher(item) {
    await this.mostrarCargando('Cargando...');
    await this._ps.allTeachersWithCode(item);

    const modal = await this.modalCtrl.create({
      component: InfoTeachSearchComponent,
      componentProps: {
        teacherFind: this._ps.everyTeachersCode,
        title: this.titulo
      }
    });
    this.loading.dismiss();
    return await modal.present();
  }//Fin goToTeacher

  async openImageComplete(detalle: string, nameImg: string) {
    await this.mostrarCargando('Cargando...');
    //Reinicio
    this.sendJSON = [];

    //Envio    
    this.sendJSON.push({
      "nombre": nameImg,
      "detalle": detalle
    });


    const modal = await this.modalCtrl.create({
      component: ShowImgCompleteComponent,
      componentProps: {
        imgRoute: this.sendJSON
      }
    });
    this.loading.dismiss();
    return await modal.present();


  }//Fin openImageComplete()

  async reemplazarAcentos(cadena) {
    var c = String.fromCharCode(92);
    this.edf = String.fromCharCode(34);

    var chars = {
      "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
      "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u", "ñ": "n",
      "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
      "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U", "Ñ": "N",
      ".": "", ":": "", "(": "", ")": "", ",": "", "'": "",
      "-": "", ";": "", "!": "", "@": "", "#": "", "$": "", "%": "",
      "{": "", "[": "", "}": "", "^": "", "&": "", "*": "", "_": "",
      "+": "", "=": "", "?": "", "¿": "", "¡": "", "/": "", "<": ""
      , ">": "", "`": "", "~": "", [this.edf]: "", " ": ""
    }
    var expr = /[áàéèíìóòúùñ.:(),'-;!@#$%{[}^&*_+=?¿¡/<>`~" ]/ig;
    var res = await cadena.replace(expr, function (e) { return chars[e] });

    return res;
  }//Fin reemplazarAcentos(cadena)

  async reemplazarAcentosEspacio(cadena) {
    var c = String.fromCharCode(92);
    this.edf = String.fromCharCode(34);

    var chars = {
      "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
      "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u", "ñ": "n",
      "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
      "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U", "Ñ": "N",
      ".": "", ":": "", "(": "", ")": "", ",": "", "'": "",
      "-": "", ";": "", "!": "", "@": "", "#": "", "$": "", "%": "",
      "{": "", "[": "", "}": "", "^": "", "&": "", "*": "", "_": "",
      "+": "", "=": "", "?": "", "¿": "", "¡": "", "/": "", "<": ""
      , ">": "", "`": "", "~": "", [this.edf]: ""
    }
    var expr = /[áàéèíìóòúùñ.:(),'-;!@#$%{[}^&*_+=?¿¡/<>`~"]/ig;
    var res = await cadena.replace(expr, function (e) { return chars[e] });

    return res;
  }//Fin reemplazarAcentosEspacio(cadena)

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

}//Fin programa
