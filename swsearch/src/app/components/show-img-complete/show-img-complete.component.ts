import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-img-complete',
  templateUrl: './show-img-complete.component.html',
  styleUrls: ['./show-img-complete.component.scss'],
})
export class ShowImgCompleteComponent implements OnInit {

  imgRoute:any[]= [];
  

    //Proabndo zoom
    slideOpts = {
     passiveListeners: false,
     onlyExternal: false,   
      zoom:{
        maxRatio:2
      }
    }

  constructor(public modal: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modal.dismiss();
  }

}
