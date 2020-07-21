import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core';
import { ModalController, AlertController, NavController, IonSelect, LoadingController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { LoadPhotoComponent } from '../load-photo/load-photo.component';
import { UiServiceService } from '../../services/ui-service.service';
import { Storage } from '@ionic/storage';
import { LoadImageService } from '../../services/load-image.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-info-user',
  templateUrl: './update-info-user.component.html',
  styleUrls: ['./update-info-user.component.scss'],
})
export class UpdateInfoUserComponent implements OnInit {

  @ViewChild('passwordEyeRegister', { static: true }) passwordEye;
  @ViewChild('carreraSelect', { static: false }) carreraSelect: IonSelect;
  user: any[] = [];
  userRef: any[] = [];
  userNew: any[] = [];
  cafe: string;
  re: string;
  us: string;
  carrers: any[] = [];
  public loading: any;
  public cero: Observable<number>;
  habl: boolean = false;
  oUserNW = {
    FOTO_PER: '',
    TOKEN_PER: ''
  };

  habilitarRegSoloBotton: boolean = false;
  fotoMemoriaTel: any;

  cedulaCom: string;
  usuarioCom: string;
  activarUpdate: boolean = false;
  activaReg: boolean = false;
  passwordTypeInput = 'password';
  iconpassword = 'eye-off';

  type = 'password';
  lock = 'lock-open-outline';

  constructor(
    public modalCrtl: ModalController,
    public _us: UsuarioService,
    private storage: Storage,
    public uiService: UiServiceService,
    public alertController: AlertController,
    public nav: NavController,
    public _cas: LoadImageService,
    public loadingController: LoadingController,
    private afStorage: AngularFireStorage

  ) {


  }

  async ngOnInit() {

    //Cargar foto default
    await this._us.loadCareers();
    this.carrers = this._us.careers;
    //Reiniciando
    this._cas.uploadPercent = this.cero;

    //Traer desde el Storage      
    const us = await (this.storage.get('user'));
    this.userRef = us;
    this.cedulaCom = us[0].CEDULA_PER;
    this.usuarioCom = us[0].USUARIO_PER;
    const a = true;
    this.activaReg = a;


    if (this.habl === false) {
      this.fotoMemoriaTel = await this._cas.loadToFirebaseCollection(this.user[0].TOKEN_PER);
      this.user[0].FOTO_PER = await this.fotoMemoriaTel;  
    } 
  }//Fin ngOnInit()

  async updateUserPoli(fUpd: NgForm) {
    if (fUpd.invalid) {
      this.uiService.toastError('Información no válida!')
      return;
    }

    //Si realizo cambios
    if (JSON.stringify(this.user) === JSON.stringify(this.userRef)) {
      this.uiService.toastInformative('No hay cambios realizados!');
      return
    }

    this.re = '';
    this.us = '';

    const fotoPPr = await this._cas.loadToFirebaseCollection(this.user[0].TOKEN_PER);
    this.user[0].FOTO_PER = fotoPPr;


    if (this.validarCamposVacios()) {

      if (this.user[0].CEDULA_PER.length >= 10 && this.user[0].CONTRASENA_PER.length >= 6) {
        const valid: any = await this._us.updateInfoUS(this.user[0]);
        await this.obtenerValStorage();
        this.closeModal();

      } else {
        this.uiService.alertaInformativaError("Información no válida!");
      }
    } else {
      this.uiService.alertaInformativaError("Hay campos vacíos");
    }

  }//Fin update()

  async obtenerValStorage() {

    //Reinicio de valores
    this.userNew = [];
    //Obtener valores 
    const token = await this.storage.get('token');
    const id_usuario = await this.storage.get('id_usuario');
    const matFavoritas = await this.storage.get('materiasFavoritas');

    if ((matFavoritas == null) || (matFavoritas == '') || (matFavoritas == undefined)) {

    } else {
      await this.storage.set('materiasFavoritas', matFavoritas)
    };

    //VER ERROR AQUI

    this.userNew.push(this.user[0]);
    //Establecer valores
    await this.storage.set('user', this.userNew);
    await this.storage.set('token', token);
    await this.storage.set('id_usuario', id_usuario);

  }//Fin obtenerValStorage()

  async closeModal() {

    await this.modalCrtl.dismiss();
    this.re = this.user[0].NOMBRE_CAR;
    this.us = this.user[0].NOMBRES_PER;

    await this.nav.navigateRoot(['/home', this.re, this.us]);

  }//Fin closeModal()

  validarCamposVacios() {
    if (
      this.user[0].CEDULA_PER === '' || this.user[0].CEDULA_PER === undefined || this.user[0].CEDULA_PER === null ||
      this.user[0].NOMBRES_PER === '' || this.user[0].NOMBRES_PER === undefined || this.user[0].NOMBRES_PER === null ||
      this.user[0].APELLIDOS_PER === '' || this.user[0].APELLIDOS_PER === undefined || this.user[0].APELLIDOS_PER === null ||
      this.user[0].ID_CAR === '' || this.user[0].ID_CAR === undefined || this.user[0].ID_CAR === null ||
      this.user[0].USUARIO_PER === '' || this.user[0].USUARIO_PER === undefined || this.user[0].USUARIO_PER === null ||
      this.user[0].CONTRASENA_PER === '' || this.user[0].CONTRASENA_PER === undefined || this.user[0].CONTRASENA_PER === null ||
      this.user[0].FOTO_PER === '' || this.user[0].FOTO_PER === undefined || this.user[0].FOTO_PER === null
    ) {
      return false;
    } else {
      return true;
    }
  }//fin validarCamposVacios()

  async openLoadPhoto() {
    const val = this.user[0].USUARIO_PER;
    if ((val == null) || (val === '') || (val === undefined)) {
      this.uiService.toastInformative("Usuario no válido!");
      return;
    }
    await this.mostrarCargando('Cargando...');
    const modal = await this.modalCrtl.create({
      component: LoadPhotoComponent,
      componentProps: {
        imgRouter: this.cafe,
        imagenPreview: this.fotoMemoriaTel,
        nameFoto: this.user[0].TOKEN_PER,
        habl: this.habl,
        update: 'update'
      }
    });
    this.loading.dismiss();
    //Obtener valores del modal
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {


      this.habl = false;
      //this.user[0].FOTO_PER = await detail.data.imgRouter;
      //this.cedulaCom = this.user[0].FOTO_PER;
      this.habl = await detail.data.habl;
      if (this.habl === true) {

        //Cargar URL de firestore en la variable, si se subio alguna foto       
        this.user[0].FOTO_PER = await detail.data.imgRouter;
        const fotoPP = await this._cas.loadToFirebaseCollection(this.user[0].TOKEN_PER);
        this.oUserNW.FOTO_PER = fotoPP;
        this.oUserNW.TOKEN_PER = this.user[0].TOKEN_PER;
        this.fotoMemoriaTel = this.user[0].FOTO_PER;
        const tr = await this._us.updatePhotoUS(this.oUserNW, this.user[0].CEDULA_PER);

        // await this.obtenerValStorage();     
        // const valid: any = await this._us.updateInfoUS(this.user[0]);
      }
    });
    return await modal.present();

  }//Fin openLoadPhoto()

  justCareers(event) {

    const idCar = event.detail.value;

    this.user[0].ID_CAR = idCar;

    for (let i = 0; i < this._us.careers.length; i++) {

      if ((this.user[0].ID_CAR) == (this._us.careers[i].ID_CAR)) {
        this.user[0].NOMBRE_CAR = this._us.careers[i].NOMBRE_CAR;
      }

    }

  }//Fin justCarrers()

  //Validacion de la cedula
  validarCedula(re) {
    var cad: any = re;
    var i;
    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;
    if (cad !== "" && longitud === 10) {
      for (i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
      total = total % 10 ? 10 - total % 10 : 0;

      if (cad.charAt(longitud - 1) == total) {
        return true;
      } else {
        return false;
      }
    }
  }//Fin validarCedula()


  seleccionarInput(tipoInput) {

    switch (tipoInput) {
      case 'esNombre':
        this.user[0].NOMBRES_PER = this.validarSoloLetras(this.user[0].NOMBRES_PER);

        break;
      case 'esApellido':
        this.user[0].APELLIDOS_PER = this.validarSoloLetras(this.user[0].APELLIDOS_PER);

        break;
      case 'esCedulaPro':
        this.user[0].CEDULA_PER = this.validarSoloNumeros(this.user[0].CEDULA_PER);

        break;
      case 'esUsuario':
        this.user[0].USUARIO_PER = this.validarSoloUsuario(this.user[0].USUARIO_PER);

        break;
      default:
        break;
    }
  }//Fin seleccionarInput()

  validarSoloNumeros(input) {
    var out = '';
    var filtro = '0123456789'; // Caracteres validos

    for (var ev = 0; ev < input.length; ev++) {
      if (filtro.indexOf(input.charAt(ev)) !== -1) {
        out += input.charAt(ev);
      }
    }
    return out;
  }//Fin validarSoloNumeros()

  async deleteBlankSpace(val){
    this.user[0].CONTRASENA_PER = await this.validarContrasena(val);
   }//Fin deleteBlankSpace(val)

   async validarContrasena(input) {
    //Eliminar los espcacios en blanco
    return input.trim();
   }//Fin validarContrasena(input)

  async validarCedulaDig(val) {
  
    if ((val.length == 10)) {
      if (this.user[0].CEDULA_PER === this.cedulaCom) { return; }
      if ((this.validarCedula(val)) && (this.user[0].CEDULA_PER !== this.cedulaCom)) {
        await this.mostrarCargando('Verificando cédula...');
        const regr = this._us.verifyCedulaReg(val).then(async () => {
          await this.loading.dismiss();

          if (this._us.stateUserCedulaOpen === true) {
            this.uiService.alertaErrorUsuario('Usuario existente en la app SwSearch (web/móvil)!');
            this.user[0].CEDULA_PER = this.cedulaCom;
          } else {

            //Valido para actualizacion
            this.uiService.toastExito('Cédula disponible!');
            this.user[0].CEDULA_PER = val;
            if (this.user[0].FOTO_PER !== 'assets/icon/teacher.jpg') {
              const foto = await this._cas.loadToFirebaseCollection(this.user[0].TOKEN_PER);
              this.user[0].FOTO_PER = foto;
            }
          }
        });
        await this.loading.dismiss();
      } else {
        this.uiService.alertaInfoResgistroError("Cédula incorrecta!");
        this.user[0].CEDULA_PER = this.cedulaCom;
      }
    }
    else if (val.length > 10) {
      this.user[0].CEDULA_PER = this.cedulaCom;
    }
    return;
  }//Fin validarCedulaDig(eventd)

  validarSoloLetras(input) {
    var out = '';
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ'; // Caracteres validos

    for (var ev = 0; ev < input.length; ev++) {
      if (filtro.indexOf(input.charAt(ev)) !== -1) {
        out += input.charAt(ev);
      }
    }
    return out;
  }//Fin validarSoloLetras()

  validarSoloUsuario(input) {
    var out = '';
    var filtro = 'ñÑáéíóúÁÉÍÓÚabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_'; // Caracteres validos @.-_

    for (var ev = 0; ev < input.length; ev++) {
      if (filtro.indexOf(input.charAt(ev)) !== -1) {
        out += input.charAt(ev);
      }
    }

    return out;
  }//Fin validarSoloLetras()

  async validarUsuario(val) {

    if ((val === this.usuarioCom) || (val === '')|| (val == null)|| (val === undefined)) { return; }

    await this.mostrarCargando('Verificando usuario...');


    const regrf = this._us.verifyUsuarioReg(val).then(async () => {
      await this.loading.dismiss();
      if (this._us.stateUserUsuarioOpen === true) {
        this.uiService.alertaInfoResgistroError('Nombre de usuario existente en la app SwSearch (web/móvil)!');

        this.user[0].USUARIO_PER = this.usuarioCom;
      } else if (this._us.stateUserUsuarioOpen === false) {
        //Valido para registrarse                               
        this.uiService.toastExito('Nombre de usuario disponible!');
        this.user[0].USUARIO_PER = val;
      }
    });

  }//Fin validarSoloLetras()

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordEye.el.setFocus();
  }//Fin togglePasswordMode()

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
