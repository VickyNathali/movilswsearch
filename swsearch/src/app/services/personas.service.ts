import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/url.servicios';
import { HttpClient } from '@angular/common/http';
 


@Injectable({
  providedIn: 'root'
})
export class PersonasService {
 

  pagina: number = 0;
  personas: any[] = [];
  usuarios2: any[] = [];

  //Busqueda realizada
  everyClassCode: any[] = [];
  everySubjectsCode: any[] = [];
  everyTeachersCode: any[] = [];

  //Busqueda de paginas
  allPeriodo: any[] = [];
  allNiveles: any[] = [];
  allAsignaturas: any[] = [];
  allParalelos: any[] = [];
  allDocentes: any[] = [];
  allMatFavoritas: any[] = [];

  //Cambio de estado
  allChangeState: any[] = [];
  valor:number = 0;

  //Resultado de la busqueda
  resultados: any[] = [];

  justAulas: any[] = [];
  aulasLabor: any[] = [];

  justSubjects: any[] = [];
  SubjectsEn: any[] = [];

  justTeachers: any[] = [];
  teachersEn: any[] = [];


  constructor(

    public http: HttpClient

  ) {
    //this.cargar_todos();  
    //this.todos_users();
  }
 

  todos_users() {

    let promesa2 = new Promise((resolve, reject) => {

      let url2 = URL_SERVICIOS + "productos/todosUsers/";

      //Reinicio del arreglo
      this.usuarios2 = [];


      this.http.get(url2)
        .subscribe((data: any) => {
          //console.log(data);
          if (data.error) {
          } else {
            this.usuarios2.push(...data.usuarios);


          }

          resolve();



        });

    });

    return promesa2;

  }//Fin todos_users()


  getPeriodo() {

    let promesa = new Promise((resolve, reject) => {

      let url = URL_SERVICIOS + "productos/buscarPeriodo/";

      //Reinicio del arreglo
      this.allPeriodo = [];


      this.http.get(url)
        .subscribe((data: any) => {
          //console.log(data);
          if (data.error) {
          } else {
            this.allPeriodo.push(...data.periodo);


          }

          resolve();



        });

    });

    return promesa;

  }//Fin getPeriodo()

  getNiveles(periodo: string,carrera: string) {

    let promesa = new Promise((resolve, reject) => {


      let url = URL_SERVICIOS + "productos/buscarNivel/" + periodo + "/"+ carrera;

      //Reinicio del arreglo
      this.allNiveles = [];


      this.http.get(url)
        .subscribe((data: any) => {
          if (data.error) {
          } else {
            this.allNiveles.push(...data.niveles); //Igual al JSON


          }

          resolve();



        });

    });

    return promesa;

  }//Fin getNiveles()

  getAsignaturas(periodo: string, nivel: string, carrera:string) {

    let promesa = new Promise((resolve, reject) => {

      let url = URL_SERVICIOS + "productos/buscarAsignatura/" + periodo + "/" + nivel + "/" +carrera;

      //Reinicio del arreglo
      this.allAsignaturas = [];


      this.http.get(url)
        .subscribe((data: any) => {
          if (data.error) {
          } else {
            this.allAsignaturas.push(...data.asignaturas); //Igual al JSON


          }

          resolve();



        });

    });

    return promesa;

  }//Fin getAsignaturas()

  getParalelos(periodo: string, nivel: string, asignatura: string, carrera:string) {

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "productos/buscarParalelo/" + periodo + "/" + nivel + "/" + asignatura + "/" + carrera;

      //Reinicio del arreglo
      this.allParalelos = [];

      this.http.get(url)
        .subscribe((data: any) => {
          if (data.error) {
          } else {
            this.allParalelos.push(...data.paralelos); //Igual al JSON               
          }
          resolve();
        });
    });

    return promesa;

  }//Fin getParalelos()

  getDocentes(periodo: string, nivel: string, asignatura: string, paralelo:string, carrera:string) {

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "productos/buscarDocente/" + periodo + "/" + nivel + "/" + asignatura+"/"+paralelo+"/"+carrera;

      console.log("Valores para busqueda");
      console.table({
        "periodo":periodo,
        "carrera":carrera,
        "nivel":nivel,    
        "asignatura":asignatura,    
        "paralelo":paralelo    
      }
      );

      //Reinicio del arreglo
      this.allDocentes = [];

      this.http.get(url)
        .subscribe((data: any) => {
          if (data.error) {
          } else {
            this.allDocentes.push(...data.docentes); //Igual al JSON               
          }
          resolve();
        });
    });

    return promesa;

  }//Fin getDocentes()

  getMatFavoritas(periodo: string, nivel: string, asignatura: string, paralelo:string, CIDoc:string, carrera:string) {
 

    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "productos/addMateriaFavorita/" + periodo + "/" + nivel + "/" + asignatura+"/"+paralelo+"/"+CIDoc+"/"+carrera;

      //Reinicio del arreglo
      this.allMatFavoritas = [];

      this.http.get(url)
        .subscribe(async (data: any) => {
          if (data.error) {
          } else {
             this.allMatFavoritas.push(...data.matFavorita); //Igual al JSON        
            console.log("esto se va a guardar");
            console.log(this.allMatFavoritas);       
          }
          resolve();
        });
    });

    return promesa;

  }//Fin getMatFavoritas()

  async searchJustClass(textoBuscar){

    
    const asigSinAcento = await this.reemplazarAcentos(textoBuscar); 

    let url = URL_SERVICIOS + "productos/buscarAula/"+asigSinAcento;

    this.justAulas = [];
    this.aulasLabor = [];
    this.resultados = [];
    
    this.http.get(url)
              .subscribe( (resp:any) => {                
                let data = resp;            
                this.resultados = data.aulasLab;  

                for (let i = 0; i < this.resultados.length; i++) {                 
                   this.justAulas.push({
                    "id": this.resultados[i].ID_AUL,
                    "nombre": this.resultados[i].NOMBRE_AUL,
                    "lat": this.resultados[i].LATITUD_AUL,
                    "lon": this.resultados[i].LONGITUD_AUL,
                    "foto": this.resultados[i].FOTO_AUL,
                    "fotoDetalle": this.resultados[i].OBSERVACIONES_AUL
                  });
                  }

                  if (this.justAulas.length === 0) {
                    this.justAulas.push({
                      "id": "Error",
                      "nombre": "No hay resultados...",
                      "lat": "",
                      "lon": "",    
                      "foto": "",
                      "fotoDetalle": ""                 
                    });
                  }

                  this.aulasLabor = this.justAulas.filter((valorActual, indiceActual, arreglo) => {
                    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
                  });
 
                  
              });              

  }//Fin searchJustClass()


  searchJustSubjects(textoBuscar){

    let url = URL_SERVICIOS + "productos/buscarNomAsignatura/"+textoBuscar;

    this.justSubjects = [];
    this.SubjectsEn = [];
    this.resultados = [];
    
    this.http.get(url)
              .subscribe( (resp:any) => {
                
                let data = resp;            
                this.resultados = data.asignaturasBus;  

                for (let i = 0; i < this.resultados.length; i++) {                 
                   this.justSubjects.push({
                    "id": this.resultados[i].CODIGO_ASIG,
                    "nombre": this.resultados[i].NOMBRE_ASIG
                  });
                  }

                  if (this.justSubjects.length === 0) {
                    this.justSubjects.push({
                      "id": "Error",
                      "nombre": "No hay resultados..."                      
                    });
                  }

                 this.SubjectsEn =   this.justSubjects.filter((valorActual, indiceActual, arreglo) => {
                     return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
                  });
              });              

  }//Fin searchJustSubjects()


  searchJustTeachers(textoBuscar){

    let url = URL_SERVICIOS + "productos/buscarNomDocente/"+textoBuscar;

    this.justTeachers = [];
    this.teachersEn = [];
    this.resultados = [];
    
    this.http.get(url)
              .subscribe( (resp:any) => {
                
                let data = resp;            
                this.resultados = data.docentesBus;  

                for (let i = 0; i < this.resultados.length; i++) {                 
                   this.justTeachers.push({
                    "id": this.resultados[i].CEDULA_DOC,
                    "nombre": this.resultados[i].NOMBRES_DOC,
                    "apellido": this.resultados[i].APELLIDOS_DOC
                  });
                  }

                  if (this.justTeachers.length === 0) {
                    this.justTeachers.push({
                      "id": "Error",
                      "nombre": "No hay ",
                      "apellido": "resultados..."
                    });
                  }

                  this.teachersEn = this.justTeachers.filter((valorActual, indiceActual, arreglo) => {
                    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
                  });

               
              });              

  }//Fin searchJustTeachers()


  allClassWithCode(id) {

    let promesa = new Promise((resolve, reject) => {

      let url = URL_SERVICIOS + "productos/buscarAulasLab/"+id;

      //Reinicio del arreglo
      this.everyClassCode = [];


      this.http.get(url)
        .subscribe((data: any) => {
          //console.log(data);
          if (data.error) {
          } else {
            this.everyClassCode.push(...data.aulasEnc);
          }
          resolve();
        });
    });
    return promesa;
  }//Fin allClassWithCode()


  allSubjectsWithCode(id) {

    let promesa = new Promise((resolve, reject) => {

      let url = URL_SERVICIOS + "productos/buscarAsignaturasGlobal/"+id;

      //Reinicio del arreglo
      this.everySubjectsCode = [];


      this.http.get(url)
        .subscribe((data: any) => {
          //console.log(data);
          if (data.error) {
          } else {
            this.everySubjectsCode.push(...data.asigEnc);
          }
          resolve();
        });
    });
    return promesa;
  }//Fin allSubjectsWithCode()


  allTeachersWithCode(id) {

    let promesa = new Promise((resolve, reject) => {

      let url = URL_SERVICIOS + "productos/buscarDocentesGlobal/"+id;

      //Reinicio del arreglo
      this.everyTeachersCode = [];


      this.http.get(url)
        .subscribe((data: any) => {
          //console.log(data);
          if (data.error) {
          } else {
            this.everyTeachersCode.push(...data.docEnc);
          }
          resolve();
        });
    });
    return promesa;
  }//Fin allTeachersWithCode()



  //Actualizacion para verificar si hubo cambios en el estado
 async viewChangeState(periodo: string, nivel: string, asignatura: string, paralelo:string, CIDoc:string){
 
    //Reinicio del arreglo
    this.allChangeState = [];
    this.valor = 0;
  
    let promesa = new Promise((resolve, reject) => {
      let url = URL_SERVICIOS + "productos/detectChangeState/" + periodo + "/" + nivel + "/" + asignatura+"/"+paralelo+"/"+CIDoc;

      this.http.get(url)
        .subscribe((data: any) => {
          if (data.error) {
          } else {
            if (data.detectChange.length > 0) {            
              this.allChangeState.push(...data.detectChange); //Igual al JSON   
             
              this.valor = 1;            
            }else{
              if (data.detectChange.length === 0){this.valor = 0;}}
           
          }
          resolve();
        });
    });

    return promesa;


  }//Fin ViewChanges

  //Se agrega este metodo, por que el  estupido servicio no funciona. Cuando hay
  //acentos o caracteres especiales sobre las letras

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
  }


}//Fin del programa
