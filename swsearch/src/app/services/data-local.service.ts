import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PersonasService } from './personas.service';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {


  materias: any[] = [];
  materiasPru: any[] = [];
  materiasN: any[] = [];
  nuevas: any[] = [];
  showChangeStates: any[] = [];
  favoritos: any[] = [];

  existe: boolean;

  constructor(

    private storage: Storage,
    public _ps: PersonasService

  ) {
    //this.loadFavorites();
  }


  async saveSubjects(materiasFavo) {
    //El metodo push, se crashea cuando viene una matriz y almacenarla
    //Se reinicia la variable materiasPru siempre que se llama la metodo

    this.materiasPru = [];

    for (let i = 0; i < this.materias.length; i++) {
      this.materiasPru.push(this.materias[i]);
    }

    this.materiasPru.push(materiasFavo);
    await this.storage.set('materiasFavoritas', this.materiasPru);
    this.materias = this.materiasPru;
  }

  saveDataStorage(materia) {
    this.storage.set('materiasFavoritas', materia);
  }


  async existeFavoritas(nombre) {

    this.materias = [];
    await this.loadFavorites();

    for (let i = 0; i < this.materias.length; i++) {
      if (JSON.stringify(this.materias[i]) === JSON.stringify(nombre)) {
        return true;
      }
    }


    return false;

  }//Fin existeFavoritas()

  async loadFavorites() {
    this.materias = [];
    const favoritas = await this.storage.get('materiasFavoritas');
  
    this.materias = favoritas || [];
    return this.materias;
  }//Fin loadFavorites


  async showStateChange(materias) {

    this.nuevas = [];

    if (materias.length == 0) {
      return;
    }

    for (let i = 0; i < materias.length; i++) {

      await this._ps.viewChangeState(materias[i][0].ID_PER, materias[i][0].ID_SEM, materias[i][0].CODIGO_ASIG, materias[i][0].PARALELO, materias[i][0].CEDULA_DOC)
        .then(() => {

          if (this._ps.valor == 1) {
            this.nuevas.push(
              this._ps.allChangeState
            );
          } //if((this._ps.allChangeState[0].ESTADO_CSAP === '0') && (this._ps.valor === 0))
          else {
            if (this._ps.valor == 0) {

              this.nuevas.push(
                materias[i]
              );
            }
          }
        });
    }


  }//Fin showStateChange()


}//Fin del servicio
