import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

//Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

//Servicios
import { LoadImageService } from "../../services/load-image.service";
import { AngularFireStorage } from '@angular/fire/storage';
import { UiServiceService } from '../../services/ui-service.service';


@Component({
  selector: 'app-load-photo',
  templateUrl: './load-photo.component.html',
  styleUrls: ['./load-photo.component.scss'],
})
export class LoadPhotoComponent implements OnInit {
 

  items: Observable<any[]>;
  imagenPreview: string;
  update: string;
  re: string;
  cambiosHecho: string;
  imagen64: string;
  blob: Blob;

  g1: any;
  g2: any;

  nameFoto: string;
  

  constructor(
    public modalCt: ModalController,
    private db: AngularFireStorage,
    private camera: Camera,
    public alertCtrl: AlertController,
    public file: File,
    public imagePicker: ImagePicker,
    public _cas: LoadImageService,
    public _iuS:UiServiceService
  ) {  }

  ngOnInit() {  
    //Capturar id de foto al iniciar
    this.cambiosHecho = this.imagenPreview;
 
  }



  async saveImg() { 
    if((this.imagenPreview === 'assets/icon/teacher.jpg')){
      this._iuS.toastInformative('Agrega una foto al perfil!');
      this.re = this.imagenPreview;
      const activart = false;
      this.modalCt.dismiss(
        {imgRouter:this.re,
        habl:activart}
      );
    }else{
      if((this.imagenPreview === this.cambiosHecho)){
        this._iuS.toastInformative('No hay foto nueva!');
        //this.closeModal();
        return;
      }      
    await this._cas.load_imagen_firebase(this.blob, this.nameFoto, this.update);
    this.re = this.imagenPreview;
    const activar = true;
    this.modalCt.dismiss(
      {imgRouter:this.re,
      habl:activar}
      
    );
  }
     
  }//Fin saveImg()
  

  async openCamera() {

    //Reinicio de variable
   
    const options2: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.camera.getPicture(options2).then(async (imageData) => {

      let base64Str = 'data:image/jpeg;base64,' + imageData;
      let fileName = imageData.substring(imageData.lastIndexOf('/') + 1);
      let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      this.file.readAsDataURL(path, fileName).then((base64data) => {
        this.imagenPreview = base64data;
        this.imagen64 = base64Str;
      });

      //Enviar
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, fileName);
      this.blob = new Blob([buffer], { type: 'image/jpeg' });
    });


  }//Fin openCamera()

  async openGalery() {

    var options3: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 15
    }

    this.imagePicker.getPictures(options3).then(async (results) => {
      for (var i = 0; i < results.length; i++) {
        let base64Str = 'data:image/jpeg;base64,' + results[i];
        let filenames = results[i].substring(results[i].lastIndexOf('/') + 1);
        let path = results[i].substring(0, results[i].lastIndexOf('/') + 1);
        this.file.readAsDataURL(path, filenames).then((base64string) => {
          this.imagenPreview = base64string;
          this.imagen64 = base64Str;
        });
        //Enviar
        const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, filenames);
        this.blob = new Blob([buffer], { type: 'image/jpeg' });


      }
    }, (err) => { });


  }//Fin openGalery()

async closeModal() {
   
    if((this.imagenPreview === 'assets/icon/teacher.jpg')){
      this.re = this.imagenPreview;
      const activart = false;
      this.modalCt.dismiss(
        {imgRouter:this.re,
        habl:activart}
      );
    }
    if ((this.imagenPreview === this.cambiosHecho)) {
      this.re = this.imagenPreview;
      //Aqui hacemos un cambio
      const activart = false;
      this.modalCt.dismiss(
        {imgRouter:this.re,
        habl:activart}
      );
    }
    else{
      //Se subio una nueva imagen
      const alert = await this.alertCtrl.create({
        header: 'Aviso',
        message: '¿Deseas salir, sin guardar los cambios realizados?',
  
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'cssBotonCancelarll',
            handler: () => {
               //Aqui hacer la comparacion
               alert.dismiss(); 
            }
          },
          {
            text: 'Aceptar',
            role: 'ok',
            cssClass: 'cssBotonOkll',
            handler: () => {
             
              this.re = this.imagenPreview;
              //Aqui hacemos un cambio
              const activart = false;
              this.modalCt.dismiss(
                {imgRouter:this.re,
                habl:activart}
              );

              
            } 
          }
        ]
      });
  
      await alert.present();
      

    }//else
   
  }//Fin closeModal()




}
