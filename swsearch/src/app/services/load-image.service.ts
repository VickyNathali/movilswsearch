import { Injectable } from '@angular/core';


import { UiServiceService } from '../services/ui-service.service';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class LoadImageService {

  public uploadPercent: Observable<number>;
  public urlEnviar: Observable<string>

  public loading: any;
  fin:number = 0;

  constructor(

    public uiSer: UiServiceService,
    private afStorage: AngularFireStorage,
    private dbC: AngularFirestore,
    public loadingController: LoadingController

  ) { }


  async load_imagen_firebase(blob: Blob, cedula: string, mensaje: string) {

    if (mensaje === 'register') {
      await this.mostrarCargandoLogin('Guardando foto...');
      
    } else {
      await this.mostrarCargandoLogin('Actualizando foto...');      
    }
    const ref = this.afStorage.ref(cedula);
    const task = ref.put(blob);
    this.uploadPercent = task.percentageChanges();

     task.snapshotChanges().pipe(
      finalize(async () => {
      this.urlEnviar = ref.getDownloadURL();
      }
      )).subscribe();
      this.loading.dismiss();

  }//Fin load_imagen_firebase()


  //TRaer la URL de Firebase
  async loadToFirebaseCollection(imgName: string) {
  
    /* let img;
    img = firebase.storage().ref(imgName).getDownloadURL();   */
    let ref = firebase.storage().ref();
    const imgRef = ref.child(imgName);
    const downloadURL = await imgRef.getDownloadURL().then(url => url) // Si todo bien, retorna la URL
    .catch(error => {
      // Error, puede que no exista la imagen
      console.log('Error:', error)
      return 'assets/icon/teacher.jpg';
    });
   
    return downloadURL


  }//Fin loadToFirebaseCollection()


  async mostrarCargandoLogin(mensaje: string) {

    this.loading = await this.loadingController.create({
      message: mensaje,
      animated: true,
      translucent: true,
      duration:1000,
      mode: 'ios',
      spinner: 'bubbles',
      cssClass: 'spinner-personalizado'
    });

    return this.loading.present();
  }//Fin mostrarCargandoLogin()

}//Fin del programa

