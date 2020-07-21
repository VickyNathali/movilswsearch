import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/url.servicios';
import { UiServiceService } from '../services/ui-service.service';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, Platform, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string;
  id_usuario: string;

  public loading: any;
  public toast: any;
 

  //Guardar en el storage
  tipoU: string = null; //null por defecto

  careers: any[] = [];
  userInfo: any[] = [];
  stateUserOpen: boolean;
  stateUserCedulaOpen: boolean;
  stateUserUsuarioOpen: boolean;
  tokenPer : any;

  constructor(

    public http: HttpClient,
    private alertCtrl: AlertController,
    private uiService: UiServiceService,
    public loadingController: LoadingController,
    private storage: Storage,
    private toastController: ToastController,
    public navCtrol: NavController,
    public router:Router

  ) {
    this.cargar_storage();     
   }


 async loginUs(usuario: string, contrasena: string) {
    
    await this.mostrarCargandoLogin('Autentificando...');
    let data = new FormData();
    data.append("usuario_per", usuario);
    data.append("contrasena_per", contrasena);

    let url = URL_SERVICIOS + "login/login";
    return this.http.post(url, data)
      .pipe(map(async (data_resp: any) => {
        if (data_resp.error) {
          await this.cargandoLogin(data_resp.mensaje);        
          this.loading.dismiss();
        } else {
          this.token = data_resp.token;
          this.id_usuario = data_resp.cedula_per;    
          //Guardar en el storage
          await this.guardar_storage();
          await this.router.navigate(['home', this.userInfo[0].NOMBRE_CAR, this.userInfo[0].NOMBRES_PER]);
          this.uiService.toastExito2('Autentificación exitosa!');
          this.loading.dismiss();
          
        }//Fin data_resp.error

        console.log("Capturar el error");
        console.log(data_resp.error);
         
      }
      
      ));
    
      
  }//Fin loginUs()

  async desactivateUs(usuario: string, contrasena: string, token: string) {
   await this.mostrarCargandoLogin('Desactivando cuenta...');
    let data = new FormData();
    data.append("usuario_per", usuario);
    data.append("contrasena_per", contrasena);
    data.append("token_per", token);
    let url = URL_SERVICIOS + "login/eliminarUser";
    return this.http.post(url, data)
      .pipe(map((data_resp: any) => {
        if (data_resp.error) {
          this.uiService.alertaInformativaLogin(data_resp.mensaje);
          this.loading.dismiss();
        } else {
          this.uiService.toastExito('Cuenta desactivada!');
          this.storage.clear();
          this.loading.dismiss();
          this.navCtrol.navigateRoot('/login', { animated: true });           
          
          //this.token = data_resp.token; 
        }
        
      }));
  }//Fin deleteUs()

  async deleteUser(cedula:string){
    await this.mostrarCargandoLogin('Eliminando esta cuenta...');
      let url = URL_SERVICIOS + "login/borrarUsuario/"+cedula;
      return new Promise(resolve => {
        this.http.delete(url)
          .subscribe((data_resp: any) => {
            if (data_resp.error) {
              this.uiService.alertaInformativaLogin(data_resp.mensaje);
              this.loading.dismiss();
            } else {
              this.uiService.toastExito('Cuenta eliminada!');
              this.storage.clear();
              this.loading.dismiss();
              this.navCtrol.navigateRoot('/login', { animated: true });           
              
            }}
            );
      });

  }//Fin deleteUser()

  async close_session() {
    await this.mostrarCargandoLogin('Cerrando sesión...');

    this.token = null;
    this.id_usuario = null;
    this.userInfo = [];

    //Guardar storage
    this.guardar_storage();
    await this.router.navigate(['login']);    

    this.loading.dismiss();
  }//Fin close_session()


 async guardar_storage() {

    await this.getInfoUser(this.id_usuario);      

   await this.storage.set('token', this.token);
   await this.storage.set('id_usuario', this.id_usuario);
   await this.storage.set('user', this.userInfo);
   const matFav = await this.storage.get('materiasFavoritas');
   await this.storage.set('materiasFavoritas', matFav);

   }//guardar_storage()

 async guardar_storageUpdate(user) {

    await this.getInfoUser(user); 
    await this.storage.set('user', this.userInfo);
    await this.storage.set('token', this.userInfo[0].TOKEN_PER);
    await this.storage.set('id_usuario', this.userInfo[0].CEDULA_PER);
   }//guardar_storage()

  cargar_storage() {

    let promesa = new Promise((resolve, reject) => {

      this.storage.ready().then(() => {

        this.storage.get("token").then(token => {
          if (token) {
            this.token = token;
          }
        })

        this.storage.get("id_usuario").then(id_usuario => {
          if (id_usuario) {
            this.id_usuario = id_usuario;
            /* console.log("Esto estamos viendo: "+this.id_usuario);
            this.getInfoUser(this.id_usuario); */
          }
          resolve();
        })
        
      });
      
    });
    
    return promesa;

  }//Fin cargar_storage()

  activo():boolean{

    if (this.token) {
      return true;
    }else{
      return false;
    }

  }//Fin activo()

  async registerUS(usuario) {
     
    await this.mostrarCargandoLogin('Espere, creando su cuenta...');
    let data = new FormData();
    data.append("cedula_per", usuario.cedula);
    data.append("nombres_per", usuario.nombres);
    data.append("apellidos_per", usuario.apellidos);
    data.append("carrera_per", usuario.carrera);
    data.append("usuario_per", usuario.usuario);
    data.append("contrasena_per", usuario.contrasena);
    data.append("token_per", usuario.token);
    data.append("foto_per", usuario.foto);

    let url = URL_SERVICIOS + "login/registro";
    return new Promise(resolve => {
      this.http.post(url, data)
        .subscribe(async resp => {
          if (resp['error'] === false) {
            await this.loading.dismiss();
            this.uiService.toastExito(resp['mensaje']);

            resolve(true);
          } else {
            this.uiService.toastError(resp['mensaje']);
            resolve(false);
            this.storage.clear();
            await this.loading.dismiss();
          }
        }, error => {
          this.loading.dismiss();
          if (error.error.error === true) {
            this.uiService.toastError(error.error.mensaje);
          } else {
           this.uiService.toastExito(error.error.mensaje);
          }
        });
    });
/*   } catch (error) {
    this.loading.dismiss();
    this.uiService.toastError(error);
    console.log('registro', error);
  }  */
  }//Fin registerUS()


 async updateInfoUS(usuario){

    await this.mostrarCargandoLogin('Espere, actualizando información...');
    let data = new FormData();
    data.append("cedula_per", usuario.CEDULA_PER);
    data.append("nombres_per", usuario.NOMBRES_PER);
    data.append("apellidos_per", usuario.APELLIDOS_PER);
    data.append("carrera_per", usuario.ID_CAR);
    data.append("usuario_per", usuario.USUARIO_PER);
    data.append("contrasena_per", usuario.CONTRASENA_PER);
    data.append("token_per", usuario.TOKEN_PER);
    data.append("foto_per", usuario.FOTO_PER);

    let url = URL_SERVICIOS + "login/modificarInfo";

    return new Promise(resolve => {
      this.http.post(url, data)
        .subscribe(resp => {
          if (resp['error'] === false) {
            this.loading.dismiss();
            this.uiService.toastExito(resp['mensaje']);
            this.guardar_storageUpdate(usuario.CEDULA_PER);
            resolve(true);
          } else {
            this.uiService.toastError(resp['mensaje']);
            this.loading.dismiss();
            resolve(false);
            this.storage.clear();
          }
        }, error => {
          this.loading.dismiss();
          if (error.error.error === true) {
            this.uiService.toastError(error.error.mensaje);
          } else {
            this.uiService.toastExito(error.error.mensaje);
            //this.uiService.alertaInfoCargarImg('Posible error');
          }
        });
    });

  }//Fin updateInfoUS()

 async updatePhotoUS(usuario,cedula){

    await this.mostrarCargandoLogin('Espere, actualizando foto de perfil...');
    let data = new FormData();    
    data.append("token_per", usuario.TOKEN_PER);
    data.append("foto_per", usuario.FOTO_PER);

    let url = URL_SERVICIOS + "login/modificarFoto";

    return new Promise(resolve => {
      this.http.post(url, data)
        .subscribe(resp => {
          if (resp['error'] === false) {
            this.loading.dismiss();
            this.uiService.toastExito(resp['mensaje']);
             this.guardar_storageUpdate(cedula);
            resolve(true);
          } else {
            this.uiService.toastError(resp['mensaje']);
            this.loading.dismiss();
            resolve(false);
            this.storage.clear();
          }
        }, error => {
          this.loading.dismiss();
          if (error.error.error === true) {
            this.uiService.toastError(error.error.mensaje);
          } else {
            this.uiService.toastExito(error.error.mensaje);
            //this.uiService.alertaInfoCargarImg('Posible error');
          }
        });
    });

  }//Fin updatePhotoUS()


  async mostrarCargandoLogin(mensaje: string) {
    
    this.loading = await this.loadingController.create({
      message: mensaje,
      animated: true,
      translucent: true,
      mode: 'ios',
      spinner: 'bubbles',      
    });
    
    return this.loading.present();
  }//Fin mostrarCargandoLogin()

  async cargandoLogin(message: string) {
  
    this.toast = await this.toastController.create({
      message,
      duration: 1000,
      position: 'top',       
      cssClass: 'toast-wrapper-error',
      buttons: [{side: 'start',role: 'cancel',icon: 'close-circle',handler: () => {
        this.cargandoLogin(message);
      }}],
    });
    return this.toast.present();
     
  }//Fin mostrarCargandoLogin()

  loadCareers() {

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "productos/obtenerCarrera/";
      //Reinicio del arreglo
      this.careers = [];

      this.http.get(url)
        .subscribe((data: any) => {
          //console.log(data);
          if (data.error) {
          } else {
            this.careers.push(...data.carrera);
          }
          resolve();
        });
    });
    return promesa;

  }//Fin loadCareers()

  getInfoUser(cedula:string){

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "productos/obtenerInfoUsuario/"+cedula;
      //Reinicio del arreglo
      this.userInfo = [];

      this.http.get(url)
        .subscribe((data: any) => {          
          if (data.error) {
            //Si no se encuetra a ese usuario
          } else {
            this.userInfo = (data.usuario);
             
          }
          resolve();
        });
    });
    return promesa;

  }//Fin getInfoUser()

  getTokenDefault(){

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "login/getToken";
      //Reinicio del arreglo
      this.tokenPer = '';

      this.http.get(url)
        .subscribe((data: any) => {          
          if (data.error) {
            //Si no se encuetra token per
          } else {
            this.tokenPer = data.token;
             
          }
          resolve();
        });
    });
    return promesa;

  }//Fin getInfoUser()

  returnInfo(){
return this.userInfo;
  }

  verifyUserReg(cedula:string, usuario:string){

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "login/verificarUser/"+cedula+"/"+usuario;
      //Reinicio del arreglo
      this.stateUserOpen = false;

      this.http.get(url)
        .subscribe((data: any) => {          
          if (data.error) {
            //Si no se encuetra a ese usuario
          
          } else {
            this.stateUserOpen = data.datos;          
              
          }
          resolve();
        });
    });
    return promesa;

  }//Fin verifyUserReg()

  verifyCedulaReg(cedula:string){

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "login/verificarCedula/"+cedula;
      //Reinicio del arreglo
      this.stateUserCedulaOpen = false;

      this.http.get(url)
        .subscribe((data: any) => {          
          if (data.error) {
            //Si no se encuetra a ese usuario
          
          } else {
            this.stateUserCedulaOpen = data.datos;         
          }
          resolve();
        });
    });
    return promesa;

  }//Fin verifyCedulaReg()

  verifyUsuarioReg(usuario:string){

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "login/verificarUsuario/"+usuario;
      //Reinicio del arreglo
      this.stateUserUsuarioOpen = false;

      this.http.get(url)
        .subscribe(async (data: any) => {          
          if (data.error) {
            console.log("Error encintrado");
            //Si no se encuetra a ese usuario
            console.log(data.error);
          
          } else {
             this.stateUserUsuarioOpen = await data.datos;         
          }
          resolve();
        });
    });
    return promesa;

  }//Fin verifyCedulaReg()

}//Fin del programa
