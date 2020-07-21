import { Component, OnInit, ViewChild, AbstractType } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../services/ui-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('passwordEyeRegister', { static: true }) passwordEye;


  //Credenciales
  logoPath = "assets/imgs/login.jpg";
  public loading: any;


  passwordTypeInput = 'password';
  iconpassword = 'eye-off';

  type = 'password';
  lock = 'lock-open-outline';

  loginUser = {
    usuario: '',
    contrasena: ''
  };

  public unsubscribeBackEvent: any;
  public clickClose: number = 0;
  public irRegistro: boolean = false;
   

  constructor(

    public navCtrl: NavController,
    private _userService: UsuarioService,
    private uiServiceMen: UiServiceService,
    public loadingController: LoadingController,
    public router: Router,    
    public alertController: AlertController,
    private platform: Platform

  ) { 

    

  }

  ngOnInit() {
    this.initializeBackButtonCustomHandler();     
  }//Fin ngOnInit() 


  async loginUserPoli(fLogin: NgForm) {

    if (fLogin.invalid) {   
      this.uiServiceMen.toastError('Información no válida!')   
      return;
    }
    
    (await this._userService.loginUs(this.loginUser.usuario, this.loginUser.contrasena))
    .subscribe(() => {
      console.log("Objetivo completado");
    //  this.loading.dismiss();
    });
    

  }//Fin loginUserPoli()


 goRegister() {
       this.router.navigateByUrl('/register'); 
  }//Fin goRegister()

  goHelp() {
    this.router.navigateByUrl('/ayuda'); 
}//Fin goHelp()


  seleccionarInput(tipoInput) {
    switch (tipoInput) {
      case 'esNombre':
        this.loginUser.usuario = this.validarSoloLetras(this.loginUser.usuario);
        break;
      case 'esCedula':
        this.loginUser.contrasena = this.validarSoloNumeros(this.loginUser.contrasena);
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

  validarSoloLetras(input) {
    var out = '';
    var filtro = 'ñÑáéíóúÁÉÍÓÚabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_'; // Caracteres validos @.-_

    for (var ev = 0; ev < input.length; ev++) {
      if (filtro.indexOf(input.charAt(ev)) !== -1) {
        out += input.charAt(ev);
      }
    }
    return out;
  }//Fin validarSoloLetras()


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
      spinner: 'bubbles',
      cssClass: 'spinner-personalizado'
    });
    
    return this.loading.present();
  }//Fin mostrarCargandoLogin()

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent;
  }

  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999, async () => {
     
          await this.mostrarCargandoLogin('Cargando...');         
     

          //Para saber si esta en la pagina raiz, y mostrar el mensaje de salir
          //de la aplicacion

          if (this.router.isActive('/login', true) && this.router.url === '/login') {
            this.mensaje();
          }

          if (this.router.isActive('/register', true) && this.router.url === '/register') {
           // this.mensaje();
            
              this.uiServiceMen.toastInformative("Botón inhabilitado!");
              //this.irRegistro = false;
             
          }

          if (this.router.isActive('/ayuda', true) && this.router.url === '/ayuda') {
            this.router.navigateByUrl('/login'); 
          }
                    
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

}//Fin mensaje()
  
 

}//Fin del programa
