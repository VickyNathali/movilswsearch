import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-profile-teach',
  templateUrl: './info-profile-teach.component.html',
  styleUrls: ['./info-profile-teach.component.scss'],
})
export class InfoProfileTeachComponent implements OnInit {

  title:string;
  //Teacher selected
  profileTeac:any[]=[];

  logoProfile = "assets/icon/teacher.jpg";

  constructor(public modal: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modal.dismiss();
  }//Fin closeModal()

}//Fin del programa
