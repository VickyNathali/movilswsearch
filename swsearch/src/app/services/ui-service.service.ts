import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { ParseTreeResult } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  isLoading = false;

  constructor(

    private alertController: AlertController,
    private toastController: ToastController,
    public ldgController: LoadingController,

  ) { }

  async alertaInformativaLogin(message:string) {
    const alert = await this.alertController.create({
      header: 'Login',
      message,
      buttons: [
    {
      text: 'OK',
      cssClass:'cssBotonOk'}]
    });

    await alert.present();
  }

  async alertaInformativaError(message:string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: [
    {
      text: 'OK',
      cssClass:'cssBotonOk'}]
    });

    await alert.present();
  }

  async alertaInfoResgistroError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1700,       
      position: 'top',
      cssClass: 'toast-wrapper-error',    
      buttons: [{side: 'start',role: 'cancel',icon: 'close-circle',handler: () => {
        this.alertaInfoResgistroError(message);
      }}],
    
      
    });
    await toast.present();
  }

  async alertaErrorUsuario(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2200,       
      position: 'top',
      cssClass: 'toast-wrapper-error',    
      buttons: [{side: 'start',role: 'cancel',icon: 'close-circle',handler: () => {
        this.alertaInfoResgistroError(message);
      }}],
    
      
    });
    await toast.present();
  }

  async toastError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1600,
      position: 'top',
      cssClass: 'toast-wrapper-error',
      buttons: [{side: 'start',role: 'cancel',icon: 'close-circle',handler: () => {
        this.toastError(message);
      }}],
    });
    toast.present();
  }
  async toastInformative(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1600,
      position: 'top',
      cssClass: 'toast-wrapper-informative',      
      buttons: [{side: 'start',role: 'cancel',icon: 'information-circle',handler: () => {
        this.toastInformative(message);
      }}],
    });
    toast.present();
  }
  async toastExito(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      position: 'top',
     cssClass: 'toast-wrapper-success',     
     buttons: [{side: 'start',role: 'cancel',icon: 'checkmark-circle',handler: () => {
      this.toastExito(message);
    }}],
    });
    toast.present();
  }
  async toastExito2(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'top',
       cssClass: 'toast-wrapper-success',
     buttons: [{side: 'start',role: 'cancel',icon: 'checkmark-circle',handler: () => {
      this.toastExito2(message);
    }}],
    });
    toast.present();
  }

  async Cargando(message:string) {
    this.isLoading = true;
    return await this.ldgController.create({
      message,
     mode:'ios'
    }).then(a => {
      a.present().then(() => {
        
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('Listo'));
        }
      });
    });
  }

  async Guardando(message:string) {
    this.isLoading = true;
    return await this.ldgController.create({
      message,
     mode:'ios',
     spinner: 'bubbles'
    }).then(a => {
      a.present().then(() => {
        
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('Listo'));
        }
      });
    });
  }
  

  async CerrarCargando() {
    this.isLoading = false;
    if (this.isLoading) {
      return await this.ldgController.dismiss().then(() => console.log('Listo'));
    }
     
  }
  async CerrarGuardando() {
    this.isLoading = false;
    if (this.isLoading) {
      return await this.ldgController.dismiss().then(() => console.log('Listo'));
    }
     
  }

}//Fin del programa
