import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

//Navegar con google
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { UiServiceService } from '../../services/ui-service.service';



@Component({
  selector: 'app-info-lab-search',
  templateUrl: './info-lab-search.component.html',
  styleUrls: ['./info-lab-search.component.scss'],
})
export class InfoLabSearchComponent implements OnInit {

  //Vienen la clase encontrada y sus horarios de clases
  classFind: any[] = [];

  title: string;

  //Clasificar por dias
  days: any[] = [];
  daysNoRepeat: any[] = [];
  ordenDaysClass: any[] = [];
 
 

  //Navegacion
  //Coordenadas
  destination2: string;
  start2: string;
  public zoom: number;
  latStart: number;
  lonStart: number;

  constructor(
    public modal: ModalController,
    private launchNavigator: LaunchNavigator,
    public alertCtrl: AlertController,
    public _ui:UiServiceService

  ) {
    this.setCurrentPosition();
   }

  ngOnInit() {
    this.justDays();
     
  }


  closeModal() {
    this.modal.dismiss();

  }

  async goToClassNavigate(lat: string, lon: string, aula: string) {

    await this.setCurrentPosition();

    //Si las coordenadas son undefined    
    if ((this.latStart == null) || (this.latStart === undefined)) {   
      this._ui.toastInformative("Activa el GPS!");
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
  private async setCurrentPosition() {

    if ("geolocation" in navigator) {
      await navigator.geolocation.getCurrentPosition(position => {
        this.latStart = position.coords.latitude;
        this.lonStart = position.coords.longitude;
        this.zoom = 16;
      });

    }

  }//Fin setCurrentPosition()


  //Tratamiento
  justDays() {
    this.days = [];
    this.daysNoRepeat = [];
    this.ordenDaysClass = [];
     
    for (let i = 0; i < this.classFind.length; i++) {

      this.days.push(this.classFind[i].DESCRIPCION_DIA);

    }

    this.daysNoRepeat = this.days.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);


    //Push en los dias encontrados

    for (let j = 0;  j < this.daysNoRepeat.length; j++) {
      for (let i = 0; i < this.classFind.length; i++) {
        if (this.classFind[i].DESCRIPCION_DIA === this.daysNoRepeat[j]) {
          
            this.ordenDaysClass.push( this.classFind[i]);

        }
      }
    } 
   


  }//Fin justDays

}
