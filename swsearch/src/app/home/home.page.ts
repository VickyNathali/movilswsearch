import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, AlertController, ModalController, PopoverController, LoadingController, Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonasService } from "../services/personas.service";
import { DataLocalService } from '../services/data-local.service';
import { UsuarioService } from '../services/usuario.service';
import { SearchGlobalComponent } from '../components/search-global/search-global.component';
import { InfoMatFavoriteComponent } from 'src/app/components/info-mat-favorite/info-mat-favorite.component';
import { Storage } from '@ionic/storage';
import { OptionsUserComponent } from '../components/options-user/options-user.component';
import { UiServiceService } from '../services/ui-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  //Ocultar hijo
  ocultarClic: boolean = false;

  //Materias favoritas
  matFavoritas: any[] = [];


  logoSearch = "assets/imgs/mostrar.png";

  //Recibir la cedula desde login
  name: string;
  user: string;

  //Recibir desde el modal
  cafe: string;

  //Ocultar el deslizar
  hiddenRefr = true;

  mostrarBoton: boolean = true;
  mostrarBotonRed: boolean = false;
  public loading: any;

  public unsubscribeBackEvent: any;
  public clickClose: number = 0;


  constructor(
    public _ps: PersonasService,
    public _ds: DataLocalService,
    public modalCtrol: ModalController,
    public alertController: AlertController,
    public dataLocal: DataLocalService,
    public _iuS: UiServiceService,
    public _us: UsuarioService,
    public storage: Storage,
    public activa: ActivatedRoute,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    private platform: Platform,
    public navCtrl: NavController,
    public router: Router

  ) {
  }

  async ngOnInit() {
    this.initializeBackButtonCustomHandler();
    await this.mostrarCargando('Cargando...');
    await this.checkState();
    await this.cargarinfo();
    await this.loading.dismiss();

  }//Fin ngOnInit()

  async cargarinfo() {

    this.name = this.activa.snapshot.paramMap.get('id');
    if ((this.name == null) || (this.name == '') || (this.name == undefined)) {
      this.name = 'SISTEMAS/SOFTWARE'
    }

    this.user =  this.activa.snapshot.paramMap.get('name');
    if ((this.user == null) || (this.user == '') || (this.user == undefined)) {
      this.user = 'Usuario'
    }

  }//Fin cargarinfo()

  doRefresh(event) {
    this.hiddenRefr = true;
    setTimeout(() => {
      this.checkState();
      event.target.complete();
      this.hiddenRefr = false;
    }, 500);

  }//Fin doRefresh()

  async checkState() {

    this.matFavoritas = [];
    //Cargar desde DataStorage
    this.matFavoritas = await this.dataLocal.loadFavorites();
    //const matFavoritas
    await this.dataLocal.showStateChange(this.matFavoritas);
    this._ds.nuevas.reverse();
  }//Fin checkState()

  async deleteOption(asignatura) {


    const alert = await this.alertController.create({
      header: 'Aviso',
      message: '¿Desea eliminar <strong>' + asignatura[0].NOMBRE_ASIG + '</strong> de favoritas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cssBotonCancelarll',
          handler: (blah) => {
            alert.dismiss();
          }
        }, {
          text: 'Aceptar',
          role: 'ok',
          cssClass: 'cssBotonOkll',
          handler: async () => {

            this.matFavoritas = this.matFavoritas.filter(d => d != asignatura);
            await this.dataLocal.saveDataStorage(this.matFavoritas);
            this.checkState();
          }
        }
      ]
    });

    await alert.present();


  }//Fin deleteOption()

  async addSubjectFavorite() {

    //Abrir el modal(Add-Subjects Component)
    this.ocultarClic = !this.ocultarClic;
    this.mostrarBoton = false;
    this.mostrarBotonRed = true;

  }//Fin addSubjectFavorite

  async escuchaC(userToSaveFavorite) {

    //IMPORRTANTE
    //Mandar la nueva Cadena EN EL event
    this.matFavoritas = [];
    this.matFavoritas.push(userToSaveFavorite);
    this.ocultarClic = !this.ocultarClic;
    this.mostrarBoton = true;
    this.mostrarBotonRed = false;

    this.checkState();


  }//Fin escuchaC

  async searchSubjects() {
    await this.mostrarCargando('Cargando...');
    const modal = await this.modalCtrol.create({
      component: SearchGlobalComponent,
      componentProps: { titulo: this.name }
    });
    this.loading.dismiss();
    return await modal.present();

  }//Fin searchSubjects   

  async openInfoMatFavorite(item) {
    await this.mostrarCargando('Cargando...');
    const modal = await this.modalCtrol.create({
      component: InfoMatFavoriteComponent,
      componentProps: {
        listAulas: item,
        titulo: this.name
      }
    });
    this.loading.dismiss();
    return await modal.present();

  }//Fin openInfoMatFavorite()


  async openOptions(ev: any) {
    const us = await (this.storage.get('user'));

    const popover = await this.popoverController.create({
      component: OptionsUserComponent,
      componentProps: {
        userStorage: us
      },
      event: ev,
      mode: 'ios',

    });

    return await popover.present();

  }//Fin openOptions()


  changeButtons() {
    this.ocultarClic = !this.ocultarClic;
    this.mostrarBoton = true;
    this.mostrarBotonRed = false;
  }//Fin changeButtons()

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


  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent;
  }//Fin ionViewWillLeave()

  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999, async () => {

      //Cerrar todo
      //Se produce el overlay, por que no se abrio nada de eso
      await this.mostrarCargando('Cargando...')
      const ew = (this.modalCtrol.dismiss() || this.popoverController.dismiss() || this.popoverController.dismiss() || this.alertController.dismiss())
        .then((e) => (e)).catch(error => {
          //Captura el error de overlay
          console.log("ErrorJCs: " + error);

          this.mostrarBotonRed = false;
          this.ocultarClic = false;

          //Capturar valores
          this.cargarinfo();
          
          //Cerrar todas las ventanas(add materia, popover, opciones de menu/ Usuario)
          if (this.mostrarBoton == false) {
            this.mostrarBoton = true;
            return;
          }

          console.table({
            "this.name":this.name,
            "this.user":this.user
          });

          //Para saber si esta en la pagina raiz, y mostrar el mensaje de salir
          //de la aplicacion
           if (this.router.isActive("/home/" + this.name + "/" + this.user + "", true) && ((this.router.url.indexOf("home")) > 0)) {           
          
            this.mensaje();
          }
        });

      await this.loading.dismiss();

    });

  }//Fin initializeBackButtonCustomHandler()

  async mensaje() {
    this.alertController.dismiss();
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: '¿Desea salir de la aplicación SwSearch?',
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
          text: 'Salir',
          role: 'ok',
          cssClass: 'cssBotonOkll',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();

  }//mensaje

}//Fin del programa
