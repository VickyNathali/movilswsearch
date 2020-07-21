import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalController, NavController, IonSelect, LoadingController } from '@ionic/angular';
import { PersonasService } from '../../services/personas.service';
import { DataLocalService } from 'src/app/services/data-local.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';


@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.scss'],
})
export class AddSubjectsComponent {

  //Emitir evento de recarga
  @Output() agregoNuevoSubject = new EventEmitter();
  @ViewChild('paraleloSelect', { static: false }) paraleloSelect: IonSelect;
  @ViewChild('nivelSelect', { static: false }) nivelSelect: IonSelect;
  @ViewChild('asignaturaSelect', { static: false }) asignaturaSelect: IonSelect;



  //Lista de los usuarios
  list: any[] = [];
  n: any[] = [];

  periodo: any[] = [];
  periodos: any[] = [];
  soloPeri: any[] = [];
  soloPeriodos: any[] = [];

  periodoSelec: string;
  nivelSelec: string;
  asignaturaSelec: string;
  paralelosSelec: string;
  docentesSelec: string;

  nivel: any[] = [];
  niveles: any[] = [];
  soloNivel: any[] = [];
  soloNiveles: any[] = [];

  asig: any[] = [];
  asignaturas: any[] = [];
  soloAsig: any[] = [];
  SoloAsignaturas: any[] = [];

  paral: any[] = [];
  paralelos: any[] = [];
  soloParal: any[] = [];
  soloParalelos: any[] = [];

  doc: any[] = [];
  docentes: any[] = [];
  prueba: any[] = [];
  // public prueba: Observable<string>
  soloDoc: any[] = [];
  soloDocentes: any[] = [];
  userCarrera: string;

  userToSaveFavorite: any[] = [];

  disableNivel: boolean = true;
  disableAsignatura: boolean = true;
  disableParalelo: boolean = true;
  disableDocente: boolean = true;

  mostrarSpinner: boolean = false;
  mostrarSpinnerNivel: boolean = false;
  mostrarSpinnerAsignatura: boolean = false;
  mostrarSpinnerParalelo: boolean = false;
  mostrarSpinnerGuardar: boolean = false;

  re: string;
  itemp: string;

  //Button
  activarButton: boolean = true;

  ocultarContenido: boolean = true;
  public loading: any;

  constructor(
    public modal: ModalController,
    public _ps: PersonasService,
    public dataLocal: DataLocalService,
    public uiservice: UiServiceService,
    public navCtrl: NavController,
    public storage: Storage,
    public loadingController: LoadingController

  ) {
    //this.red();
  }

  async ngOnInit() {
    this.docentes.push({
      "CI": ' ',
      "nombre": ' ',
      "apellido": ' '
    });

    this.userCarrera = '';
    const v = await (this.storage.get('user'));
    this.userCarrera = v[0].ID_CAR;

    //Llamar al servicio nuevamente para ver los nuevos ingresos
    //Cargando todos
    //Reinicio de valores        
    this.periodo = [];

    await this.mostrarCargando('Cargando...');
    await this._ps.getPeriodo()
      .then(async () => {

        //Filtrar los periodos registrados
        for (let i = 0; i < this._ps.allPeriodo.length; i++) {

          this.periodo.push({
            "id": this._ps.allPeriodo[i].ID_PER,
            "start": this._ps.allPeriodo[i].INICIO_PER,
            "end": this._ps.allPeriodo[i].FIN_PER
          });

        }
      });
    this.loading.dismiss();

   

  }//Fin de red


  async justPeriodo(event) {
    if (event.detail.value == '') { return; }    

    //Reinicio de valores  
    this.niveles = [];
    this.nivelSelect.value = '';
    this.periodoSelec = '';
    this.mostrarSpinnerNivel = true;

    const periodo = event.detail.value;

    //Mandar al otro metodo
    this.periodoSelec = periodo;

    await this._ps.getNiveles(periodo, this.userCarrera)
      .then(async () => {

        this.mostrarSpinnerNivel = false;
        //Filtrar los periodos registrados
        for (let i = 0; i < this._ps.allNiveles.length; i++) {

          this.niveles.push({
            "id": this._ps.allNiveles[i].ID_SEM,
            "sem": this._ps.allNiveles[i].DESCRIPCION_SEM
          });
        }
      }); 
  }//Fin de cambio


  async justLevels(event) {
     
    if (event.detail.value == '') { return; }
    //Reinicio de valores 
    this.nivelSelec = '';
    this.asignaturas = [];
    this.asignaturaSelect.value = '';
    this.mostrarSpinnerAsignatura = true;
    const nivel = event.detail.value;

    this.nivelSelec = nivel;

    await this._ps.getAsignaturas(this.periodoSelec, nivel, this.userCarrera)
      .then(async () => {

        this.mostrarSpinnerAsignatura = false;
        //Filtrar los periodos registrados
        for (let i = 0; i < this._ps.allAsignaturas.length; i++) {
          this.asignaturas.push({
            "id": this._ps.allAsignaturas[i].CODIGO_ASIG,
            "asig": this._ps.allAsignaturas[i].NOMBRE_ASIG
          });
        }

      });
    this.disableAsignatura = false;
  }//Fin justLevels


  async justSubjects(event) {
     
    if (event.detail.value == '') { return; }
    //Reinicio de valores  
    this.paralelos = [];
    this.paraleloSelect.value = '';
    this.asignaturaSelec = '';
    this.mostrarSpinnerParalelo = true;

    const asignatura = event.detail.value;
    this.asignaturaSelec = asignatura;

    await this._ps.getParalelos(this.periodoSelec, this.nivelSelec, asignatura, this.userCarrera)
      .then(async () => {

        this.mostrarSpinnerParalelo = false;
        //Filtrar los periodos registrados
        if(this._ps.allParalelos.length>0){
        
          for (let i = 0; i < this._ps.allParalelos.length; i++) {
            this.paralelos.push(this._ps.allParalelos[i].PARALELO);
          }       
          this.disableParalelo = false;
        }else{
          this.disableParalelo = true;
          this.uiservice.toastInformative('No tiene horarios asignados!');
        }
      });
 
  }//Fin justSubjects


  async justClassroom(event) {

    this.disableDocente = true;
    this.activarButton=true;
    
    if (event.detail.value === '') {      
      this.disableParalelo = true;
      return;
    }
    //Reinicio de valores  
    this.mostrarSpinner = true;
    this.prueba = [];
    this.paralelosSelec = '';

    const paralelo = event.detail.value;
    this.paralelosSelec = paralelo;

    await this._ps.getDocentes(this.periodoSelec, this.nivelSelec, this.asignaturaSelec, paralelo, this.userCarrera)
      .then(async () => {


        await this.docentes.shift();
        this.mostrarSpinner = false;
        //Filtrar los periodos registrados
        for (let i = 0; i < this._ps.allDocentes.length; i++) {
          this.docentes.push({
            "CI": this._ps.allDocentes[i].CEDULA_DOC,
            "nombre": this._ps.allDocentes[i].NOMBRES_DOC,
            "apellido": this._ps.allDocentes[i].APELLIDOS_DOC
          });
        }
      

        this.prueba.push(...this.docentes);

        if (this.prueba.length > 0) {
          
          await this.justTeacher(this.prueba[0].CI);
          this.disableDocente = false;
          
        }
      });

      console.log("Paralelo seleccionado");
      console.log(this.paralelosSelec);
  
      console.log("Docentes en ese ");
      console.log(this.docentes);

  }//Fin justClassroom

  async justTeacher(CIDocente) {

    if (CIDocente === '') { return; }

    
    this.docentesSelec = '';
    this.userToSaveFavorite = [];
    this.mostrarSpinnerGuardar = true;

    this.docentesSelec = CIDocente;

    await this._ps.getMatFavoritas(this.periodoSelec, this.nivelSelec, this.asignaturaSelec, this.paralelosSelec, CIDocente, this.userCarrera)
      .then(async () => {

        for (let i = 0; i < this._ps.allMatFavoritas.length; i++) {
          this.userToSaveFavorite.push(
            this._ps.allMatFavoritas[i]
          );
        }//Fin for
        this.mostrarSpinnerGuardar = false;
        const bum = this._ps.allMatFavoritas.length;
        if (bum>0) {          
          this.activarButton = false;
        }
      });
  }//fin chooseTeacher

  async disabledButtonsPer() {

    //Habilitar campo docente
    this.disableNivel = false;

    this.disableAsignatura = true;
    this.disableParalelo = true;
    this.disableDocente = true;
    this.activarButton = true;
  }//Fin disableButtons

  disabledButtonsNivel() {

    this.disableAsignatura = false;

    this.disableParalelo = true;
    this.disableDocente = true;
    this.activarButton = true;

  }//Fin disabledButtonsNivel

  disabledButtonsAsig() {
    
    //this.disableParalelo = false;
    this.disableDocente = true;
    this.activarButton = true;

  }//Fin disabledButtonsAsig

  disabledButtonsPara() {
 
    this.disableDocente = false;
   
  }//Fin disabledButtonsPara


  async saveFavoriteSubject() {
       
    if ((this.userToSaveFavorite.length == 0) || (this.userToSaveFavorite[0] === '')) {
      this.uiservice.alertaInfoResgistroError("!Esta asignatura no tiene horas de clase asignadas!");
    } else {
      const existe = await this.dataLocal.existeFavoritas(this.userToSaveFavorite);

      if (existe) {
        //True
        //Ya hay repetido
        this.uiservice.alertaInformativaError("Ya ha sido agregada a favoritas");
        this.userToSaveFavorite = [];

      } else {
        //Falso
        //Registrar

        this.uiservice.Guardando("Guardando...");
        await this.dataLocal.saveSubjects(this.userToSaveFavorite);

        //Avisar al Home, que se ingreso uno nuevo       
        this.agregoNuevoSubject.emit(this.userToSaveFavorite);
        await this.uiservice.CerrarGuardando();
        this.ocultarContenido = false;

      }
    }
   
  }//Fin saveFavoriteSubject()

  reemplazarAcentos(cadena) {
    var chars = {
      "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
      "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u", "ñ": "n",
      "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
      "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U", "Ñ": "N",
      ".": "", ":": "", "(": "", ")": "", ",": "", "'": "",
      "-": ""
    }
    var expr = /[áàéèíìóòúùñ.:(),'-]/ig;
    var res = cadena.replace(expr, function (e) { return chars[e] });
    return res;
  }//Fin reemplazarAcentos()

  async mostrarCargando(mensaje: string) {

    this.loading = await this.loadingController.create({
      message: mensaje,
      animated: true,
      translucent: true,
      mode: 'ios',
      spinner: 'bubbles',
      cssClass: 'spinner-personalizado'
    });

    return this.loading.present();
  }//Fin mostrarCargando()

}//Fin del programa
