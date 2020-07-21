import { Pipe, PipeTransform } from '@angular/core';
import { URL_IMAGENES } from '../../config/url.servicios';
 

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(codigo:string): any {
    return URL_IMAGENES+codigo;
  }

}//Fin del programa
