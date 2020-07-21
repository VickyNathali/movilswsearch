import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { PopoverController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { URL_IMAGENES } from '../../../config/url.servicios';
import { UpdateInfoUserComponent } from 'src/app/components/update-info-user/update-info-user.component';
import { Storage } from '@ionic/storage';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';



@Component({
  selector: 'app-options-user',
  templateUrl: './options-user.component.html',
  styleUrls: ['./options-user.component.scss'],
})
export class OptionsUserComponent implements OnInit {

  items: any[] = [
    { "nombre": "Perfil", "tipo": "0", "icon": "person" },
    { "nombre": "Eliminar cuenta", "tipo": "2", "icon": "trash" },
    { "nombre": "Cerrar sesión", "tipo": "3", "icon": "log-out" },
    { "nombre": "Ayuda", "tipo": "1", "icon": "help" }
  ];


  //Recibir desde el modal
  cafe: string;
  name: string;
  red: any;
  userStorage:any[]=[];

  headerTitle: string;
  public loading: any;

  constructor(

    public _us: UsuarioService,
    private popoverCtrl: PopoverController,
    public modal: ModalController,
    public alertController: AlertController,
    public storage: Storage,
    public loadingController: LoadingController,
    private previewAnyFile: PreviewAnyFile

  ) { }

  ngOnInit() { }


  openTipoAyuda(item: number) {
    if (item == 0) {
      this.openUpdateInfo();
    }
    //Ayuda
    if (item == 1) {
      this.openPdf();
      //this.deactivateUser();
    }
    if (item == 2) {
      this.deleteUser();
    }
    if (item == 3) {
      this._us.close_session();
    }
    this.popoverCtrl.dismiss(
      { headerTitle1: this.headerTitle }
    );
  }//Fin openTipoAyuda

  openPdf(){
    var url = URL_IMAGENES + "movil.pdf";;
    this.previewAnyFile.preview(url)
  .then((res: any) => console.log(res))
  .catch((error: any) => console.error(error));
  }

  async openUpdateInfo() {
    
    await this.mostrarCargando('Cargando...');   
    const rr = await this._us.getInfoUser(this.userStorage[0].CEDULA_PER);  
    const red = this._us.userInfo;
     
    if(!red){
     await this._us.close_session();
     return;
    }
    const modal = await this.modal.create({
      component: UpdateInfoUserComponent,
      componentProps: {
        user: red
      }
    });
    this.loading.dismiss();
    return await modal.present();
  }//Fin openUpdateInfo()

  async deactivateUser() {
    const user = await (this.storage.get('user'));
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: '¿Desea desactivar la cuenta: <strong> <label class="ion-text-capitalize">' + user[0].NOMBRES_PER + ' ' + user[0].APELLIDOS_PER + '</strong>?',
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
            (await this._us.desactivateUs(user[0].USUARIO_PER, user[0].CONTRASENA_PER,user[0].TOKEN_PER)).subscribe(() => {

            });
          }
        }
      ]
    });

    await alert.present();

  }//Fin deactivateUser()

  async deleteUser() {
    const user = await (this.storage.get('user'));
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: '¿Desea eliminar la cuenta: <strong> <label class="ion-text-capitalize">' + user[0].NOMBRES_PER + ' ' + user[0].APELLIDOS_PER + '</label></strong>?',
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
            await this._us.deleteUser(user[0].CEDULA_PER);
          }
        }
      ]
    });

    await alert.present();

  }//Fin deleteUser()

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

}//Fin del programa
