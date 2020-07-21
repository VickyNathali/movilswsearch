import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {

  @ViewChild('mySlider',{static:true})  slides: IonSlides;  


  inicioSesion = "assets/imgs/inicioSesion.jpeg";
  crearCuenta = "assets/imgs/crearCuenta.jpeg";

  constructor(
    public router: Router    
  ) { }

  ngOnInit() {
  }

  swipeNext(){
    this.slides.slideNext();
  }//Fin swipeNext()

  goLogin() {
    this.router.navigateByUrl('/login'); 
}//Fin goHelp()
//Fin del programa
}
