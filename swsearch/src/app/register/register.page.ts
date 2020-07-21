import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core';
import { NavController, ModalController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { UiServiceService } from '../services/ui-service.service';
import { UsuarioService } from '../services/usuario.service';
import { LoadPhotoComponent } from '../components/load-photo/load-photo.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { LoadImageService } from '../services/load-image.service';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('passwordEyeRegister', { static: true }) passwordEye;

  oUser = {
    cedula: '',
    nombres: '',
    apellidos: '',
    carrera: '',
    usuario: '',
    contrasena: '',
    token:'',
    foto: 'assets/icon/teacher.jpg'
  };

  passwordTypeInput = 'password';
  iconpassword = 'eye-off';

  type = 'password';
  lock = 'lock-open-outline';

  disableNombre: boolean = true;
  disableApellido: boolean = true;
  disableCarrera: boolean = true;
  disableUsuario: boolean = true;
  disableContrasena: boolean = true;
  disableFoto: boolean = true;
  habl: boolean = false;
  fotoDefault: string;
  tokenPers: string;
  cafe: string;
  t: any;
  carrers:any[] =[];
  fotoMemoriaTel:string;
  public cero: Observable<number>;
  public unsubscribeBackEvent: any;
  public loading: any;

   
 
  constructor(

    public navCtrl: NavController,
    public uiService: UiServiceService,
    public _us: UsuarioService,
    public _cas: LoadImageService,
    public modalCt: ModalController,
    public router: Router,    
    public loadingController: LoadingController,
    public alertController: AlertController,
    private platform: Platform
    
  ) { }


 async ngOnInit() {
   await this._us.loadCareers();
    this.carrers  =  this._us.careers; 
    //Reiniciando
    this._cas.uploadPercent = this.cero;   

    //Cargar foto default
    if (this.habl === false) {       
      this.fotoMemoriaTel = this.oUser.foto;               
    }  
  }//Fin ngOnInit()


  goLogin() {
    this.navCtrl.navigateRoot('/login', { animated: true });
  }//Fin goLogin()

  closePage() {

    this.navCtrl.navigateRoot('/login', { animated: true });

  }//Fin closePage


  async regUserPoli(fReg: NgForm) { 
    if (fReg.invalid) {   
      this.uiService.toastError('Información no válida!')   
      return;
    } 

    this.oUser.foto = await this._cas.loadToFirebaseCollection(this.oUser.token);     

    if (this.validarCamposVacios()) {

      if (this.oUser.cedula.length >= 10 && this.oUser.contrasena.length >= 6) {
         
        const valid: any = await this._us.registerUS(this.oUser);
        this.redireccionar(valid);

      } else {
        
        this.uiService.toastError("Información no válida!");
      }
    } else {
      
      this.uiService.toastError("Hay campos vacios!");
    }
  }//Fin registrar()


  async redireccionar(valid) {
    if (valid) {
      await this.navCtrl.navigateRoot('/login', { animated: true });
    } else {
      /* mensaje de error en registro */
    }
  }//Fin redireccionar()


  validarCamposVacios() {
    if (
      this.oUser.cedula === '' || this.oUser.cedula === undefined || this.oUser.cedula === null ||
      this.oUser.nombres === '' || this.oUser.nombres === undefined || this.oUser.nombres === null ||
      this.oUser.apellidos === '' || this.oUser.apellidos === undefined || this.oUser.apellidos === null ||
      this.oUser.carrera === '' || this.oUser.carrera === undefined || this.oUser.carrera === null ||
      this.oUser.usuario === '' || this.oUser.usuario === undefined || this.oUser.usuario === null ||
      this.oUser.contrasena === '' || this.oUser.contrasena === undefined || this.oUser.contrasena === null ||
      this.oUser.foto === '' || this.oUser.foto === undefined || this.oUser.foto === null
    ) {
      return false;
    } else {
      return true;
    }
  }//fin validarCamposVacios()

  async openLoadPhoto() {
    const val = this.oUser.usuario;
    if ((val == null) || (val === '') || (val === undefined)) {
      this.uiService.toastInformative("Usuario no válido!");
      return;
    }

    this.mostrarCargandoLogin('Cargando...');
    //this.habl = true;  
    
    const rer = await this._us.verifyUserReg(this.oUser.cedula, this.oUser.usuario);

    if (this._us.stateUserOpen === true) {
      this.loading.dismiss();
      this.uiService.alertaInfoResgistroError('Usuario existente en la app SwSearch (web/móvil)!'); 

    } else {  
      
      const modal = await this.modalCt.create({
        component: LoadPhotoComponent,
        componentProps: {
          imgRouter: this.cafe,
          imagenPreview: this.fotoMemoriaTel,
          nameFoto:this.oUser.token,          
          habl: this.habl,
          update:'register',
        }
      });
      this.loading.dismiss();
      //Obtener valores del modal
      modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
        this.habl =false;
        this.habl = await detail.data.habl;
 
        if (this.habl === true) {
         
          //Cargar URL de firestore en la variable, si se subio alguna foto       
          this.fotoMemoriaTel = await detail.data.imgRouter;       
          
          
        }   
       
      });
      return await modal.present();
    }

  }//Fin openLoadPhoto()

  justCareers(event: any) {

    this.oUser.carrera = event.detail.value;
    this.disableUsuario = false;

  }//Fin justCarrers()

  disabledButtonsCareer() {
    this.disableUsuario = false;
  }//Fin disabledButtonsCareer()

  //Validacion de la cedula
   validarCedula(val) {

    var cad: any = val;
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

 async seleccionarInput(tipoInput) {
    switch (tipoInput) {
      case 'esNombre':
        this.oUser.nombres = this.validarSoloLetras(this.oUser.nombres);
        this.disableApellido = false;
        break;
      case 'esApellido':
        this.oUser.apellidos = this.validarSoloLetras(this.oUser.apellidos);
        this.disableCarrera = false;
        break;
      case 'esCedulaPro':        
        this.oUser.cedula = await this.validarSoloNumeros(this.oUser.cedula);
        break;
      case 'esUsuario':       
        this.oUser.usuario = await this.validarSoloUsuario(this.oUser.usuario);
       
        break;
      default:
        break;
    }
  }//Fin seleccionarInput() 

 async seleccionarInput2(val){
    
    this.oUser.cedula = await this.validarSoloNumeros(val);
  }//Fin seleccionarInput2(val)

  async seleccionarInput3(val){     
    this.oUser.usuario = await this.validarSoloUsuario(val);
   } //Fin seleccionarInput3(val) 

  async deleteBlankSpace(val){
    this.oUser.contrasena = await this.validarContrasena(val);
   }//Fin deleteBlankSpace(val)

   async validarContrasena(input) {
    //Eliminar los espcacios en blanco
    return input.trim();
   }//Fin validarContrasena(input)

 async validarSoloUsuario(input) {
   
    var out = '';
   /*  if ((input.length == 0) && (input==='')) {
      return
    } */
    var filtro = 'ñÑáéíóúÁÉÍÓÚabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_'; // Caracteres validos @.-_

    for (var ev = 0; ev < input.length; ev++) {
      if (filtro.indexOf(input.charAt(ev)) !== -1) {
        out += await input.charAt(ev);
      }
    }
 
    return out;
  }//Fin validarSoloUsuario()

  async validarUsuario(val) {   
   
      if ((val == null) || (val === '') || (val === undefined)) {
      return;
    }
    await this.mostrarCargandoLogin('Verificando usuario...');
         
           //this.user[0].USUARIO_PER = val;                   
           const regrf = this._us.verifyUsuarioReg(val).then(async ()=>{          
            
             if (this._us.stateUserUsuarioOpen === true) {
               this.uiService.alertaErrorUsuario('Nombre de usuario existente en la app SwSearch (web/móvil)!'); 
               this.oUser.usuario = ''; 
               this.disableContrasena = true;
               this.disableFoto = true;  
               await this.loading.dismiss();                  
              }else if (this._us.stateUserUsuarioOpen === false) {
                //Valido para registrarse                               
                this.oUser.usuario = val;               
                await this.crearToken();
                this.disableContrasena = false;
                this.disableFoto = false;  
                this.uiService.toastExito('Nombre de usuario disponible!');
                await this.loading.dismiss();
             }              
           });
         
  }//Fin validarUsuario()

  async crearToken(){
      //Crear el token personalizado
         //MEtodo creado para generar el token
         const re = await this._us.getTokenDefault();
         this.tokenPers = await this._us.tokenPer; 
         this.oUser.token = this.tokenPers;
  }//fin crearToken()

 async validarCedulaDig(val){     
      if (val.length === 10) {
      if (this.validarCedula(val)) {
       await this.mostrarCargandoLogin('Verificando cédula...');
        const regr = this._us.verifyCedulaReg(val).then(async ()=>{          
          if (this._us.stateUserCedulaOpen === true) {
            this.uiService.alertaInfoResgistroError('Usuario existente en la app SwSearch (web/móvil)!'); 
            this.oUser.cedula = '';
            this.disableNombre = true;            
            await this.loading.dismiss();
          }else{
            // Listo para seguir
            this.uiService.toastExito('Cédula disponible!');
            this.disableNombre = false;
            await this.loading.dismiss();
          }
          
        });
        
        await this.loading.dismiss(); 
      } else {
        this.disableNombre = true;
        this.uiService.alertaInfoResgistroError("Cédula incorrecta");
        this.oUser.cedula = '';
      }
    }
    else if(val.length>10){
      this.oUser.cedula = '';
    }
    return;  
  }//Fin validarCedulaDig()

  validarSoloLetras(input) {
    
    var out = '';
    var filtro = 'abcdefghijklmnñopqrstuvwxyzáéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ'; // Caracteres validos

    for (var ev = 0; ev < input.length; ev++) {
      if (filtro.indexOf(input.charAt(ev)) !== -1) {
        out += input.charAt(ev);
      }
    }
    return out;
  }//Fin validarSoloLetras()

 async validarSoloNumeros(input) {
  
  var out = '';
  var filtro = '0123456789'; // Caracteres validos

  for (var ev = 0; ev < input.length; ev++) {
    if (filtro.indexOf(input.charAt(ev)) !== -1) {
      out += await input.charAt(ev);
    }
  }
  return out;   
  
  }//Fin validarSoloNumeros()

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordEye.el.setFocus();
  }//Fin togglePasswordMode()

  async mostrarCargandoLogin(mensaje: string) {
     
    this.loading = await this.loadingController.create({
      message: mensaje,
      animated: true,
      translucent: true,
      mode: 'ios',
      spinner: 'bubbles'      
    });
    
    return this.loading.present();
  }//Fin mostrarCargandoLogin()

 

}//Fin del programa
