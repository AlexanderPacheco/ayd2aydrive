import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Persona} from '../../models/InfP';
import {SfilesService} from '../../Servicios/sfiles.service';

//import {GestorArchivosService} from "./gestor-archivos.service";

import { RegistroService} from "../../Servicios/registro.service";
import { LoginService } from "../../Servicios/login.service";
import { ListArchivo } from "../../models/InfLArchivos";
import { FilesiuService } from "../../Servicios/filesiu.service";

import { Carpeta,Link } from "../../models/InfP"

import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestor-archivos',
  templateUrl: './gestor-archivos.component.html',
  styleUrls: ['./gestor-archivos.component.css']
})
export class GestorArchivosComponent implements OnInit {
  @ViewChild('alert', { static: true }) alert: ElementRef | any;
Usuario:Persona ={
    nickname: "",
    correo:     "",
    fechaNacimiento: "",
    contrasena: ""
}
link:Link ={
  link:{
    S:""
  }
}
LinkImage:any;
  ver:boolean=false;
  Archivo:any;
  extension:any;
  video:boolean=false;
  Valid:boolean = false;
  NotValid:boolean = false;
  constructor(private ServiceFiles:SfilesService,private serviciolistararchivo:RegistroService,
    private storage_user:LoginService, private filesiuService: FilesiuService) { }


  carpeta_actual:Carpeta={
    nombre: ""
  };

  folders: any;

  ngOnInit(): void {
    this.carpeta_actual = this.storage_user.getCarpeta();
    this.Usuario=this.storage_user.getLocalS();
    let usuario=this.storage_user.getLocalS();
    this.listarArchivos(usuario.nickname.toString(), this.carpeta_actual.nombre.toString());

    try {
      this.filesiuService.getFolders(this.storage_user.getLocalS().nickname.toString())
      .subscribe((data:any)=>{
        this.folders = data;
        console.log("folders: " + this.folders);
      }
      );
    } catch (error) {
      console.log(error);
    }
  }

  ListaArchivos: ListArchivo[] = [];

  detalleArchivo={
    link: "",
    extension: "",
    fechaSubida: "",
    eliminado: 0,
    nombre: "",
    nombreantiguo: "",
    folder_before: "",
    folder_after: "",
  }

  /**
   * Al iniciar sesion y al listar la informacion de las carpetas
   * @param nickname {string} nombre de la persona logeada
   * @param carpeta {string} nombre de la carpeta a listar
   */

   editar_nombrearchivo(nombrearchivo: string, nombreantiguo: string, extension: string) {
    console.log("oldname: " + nombreantiguo + " , newname: " + nombrearchivo + " , extension: " + extension);
    if (this.detalleArchivo.nombre.trim() === "" ||
      this.detalleArchivo.nombre === undefined ||
      this.detalleArchivo.nombre === null) {

      //alert("HAY UN PROBLEMA, EL NOMBRE NUEVO NO ES VALIDO.");
      this.AlertMensajes('Editar','HAY UN PROBLEMA, EL NOMBRE NUEVO NO ES VALIDO.','error','Ok',false,true,'--')

    } else {

      let nickname = this.storage_user.getLocalS().nickname.toString();
      let folder = this.storage_user.getCarpeta().nombre.toString();
      let oldname = this.detalleArchivo.nombreantiguo.toString().trim();
      let newname = this.detalleArchivo.nombre.toString().trim();
      let ext = this.detalleArchivo.extension.toString().trim();
      //console.log("folder: " + folder);

      this.filesiuService.editarArchivo(nickname, folder, oldname, newname, ext).
        subscribe(
          res => {
            //alert("EXCELENTE!!! SE HA CAMBIADO EL NOMBRE DEL ARCHIVO.");
            this.AlertMensajes('Editar','EXCELENTE!!! SE HA CAMBIADO EL NOMBRE DEL ARCHIVO.','success','Ok',false,true,'--')
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  mover_archivo(name: string, ext: string, folder_before: string, folder_after: string) {
    console.log("{ folder_before: " + folder_before + " folder_after: " + folder_after + " name: " + name + " ext: " + ext + " }");

    if (this.detalleArchivo.folder_after.trim() === "" ||
      this.detalleArchivo.folder_after === undefined ||
      this.detalleArchivo.folder_after === null) {

      //alert("HAY UN PROBLEMA, LA RUTA NUEVA NO ES VALIDA.");
      this.AlertMensajes('Mover','HAY UN PROBLEMA, LA RUTA NUEVA NO ES VALIDA.','error','Ok',false,true,'--')

    } else {

      let nickname = this.storage_user.getLocalS().nickname.toString();

      this.filesiuService.moverArchivo(nickname, folder_before, folder_after, name, ext).
        subscribe(
          res => {
            //alert("EXCELENTE!!! SE HA MOVIDO EL ARCHIVO.");
            this.AlertMensajes('Mover','EXCELENTE!!! SE HA MOVIDO EL ARCHIVO.','success','Ok',false,true,'--')
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  listarArchivos(nombre:string,carpeta:string){
    console.log(nombre);
    console.log(carpeta);
    this.serviciolistararchivo.listarArchivo(nombre,carpeta).subscribe((res:any)=>{
      this.ListaArchivos=res;
      console.log('Es lo que esta');
      console.log(res);
    });
  }

  set_detallearchivo(link: string, extension: string, fechaSubida: string, nombre: string) {
    this.detalleArchivo.link = link;
    this.detalleArchivo.extension = extension;
    this.detalleArchivo.fechaSubida = fechaSubida;
    this.detalleArchivo.nombre = nombre;
    this.detalleArchivo.nombreantiguo = nombre;
    this.detalleArchivo.folder_before = this.storage_user.getCarpeta().nombre.toString();
    this.detalleArchivo.folder_after = "";
  }

//Archivo:any
  seteo(nombre:any,extension:any,link:any){
    this.Archivo=nombre;
    this.extension=extension;
    this.LinkImage=link;

  }
  Mostrar(){
     if(this.extension.toLowerCase()=='png'||this.extension.toLowerCase()=='jpg'){
      this.ver=true;
    }else if(this.extension.toLowerCase()=='mp4'||this.extension.toLowerCase()=='avi'||this.extension.toLowerCase()=='mkv'||this.extension.toLowerCase()=='flv'||this.extension.toLowerCase()=='mov'||this.extension.toLowerCase()=='wmv'||this.extension.toLowerCase()=='divx'){
      this.video=true;

    }else{
      window.open(this.LinkImage,'_blank');
    }

    // try {
    //   this.ServiceFiles.VerFiles(this.Usuario.nickname,this.Usuario.contrasena,this.carpeta_actual.nombre,this.Archivo).subscribe((data:any)=>{
    //     if(data.Items[0]==undefined){
    //       console.log('falle');
    //     }else{
    //       this.link=data.Items[0];
    //       console.log(data);
    //       console.log('>>>>> ',this.link.link.S);
    //       this.LinkImage=this.link.link.S;
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }
  Cerrar(){
    this.ver=false;
    this.video=false;
  }
  Descargar(){

    var temp=this.LinkImage.split('/');
    var temp2=temp[3].split('.');
    var ArchivoNom=temp2[0];
    try {
      this.ServiceFiles.DownloadFiles(this.Usuario.nickname,this.Usuario.contrasena,this.carpeta_actual.nombre,ArchivoNom,this.extension).subscribe((data:any)=>{
        // if(data.Items[0]==undefined){
        //   console.log('falle');
        // }else{
        //   this.link=data.Items[0];
        //   console.log(this.link.link.S);
        // }
      });
    } catch (error) {
      console.log(error);
    }
  }
  Eliminar(){

    try {
      this.ServiceFiles.deleteFiles(this.Usuario.nickname,this.Usuario.contrasena,this.carpeta_actual.nombre,this.Archivo,1).subscribe((data:any)=>{
        if(data.Items[0]==undefined){
          console.log('falle');
          //alert('Error al eliminar el Archivo "'+this.Archivo+'"');

          this.AlertMensajes('Error','Error al eliminar el Archivo "'+this.Archivo+'"','error','Ok',false,true,'--')

          //this.NotValid=true;

          this.Cerrar();
        }else{
          //alert('Archivo "'+this.Archivo+'" eliminado correctamente.' );
          this.AlertMensajes('Eliminar','Archivo "'+this.Archivo+'" eliminado correctamente.','success','Ok',false,true,'--')
          console.log(data.Items[0]);
          //this.Valid=true;

          this.Cerrar();

        }
      });
    } catch (error) {
      console.log(error);
    }

  }
  closeAlert() {
    this.Valid=false;
    this.NotValid=false;
    this.alert.nativeElement.classList.remove('show');
  }

  //Mensajes o Alertas
AlertMensajes(titulo:any,texto:any,tipo:any,btnAceptxt:any,sn_Cancel:boolean,OneDialog:boolean,txtSecondDialog:any){
  //tipo: warning,success,error

  if(OneDialog){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: tipo,
      showCancelButton: sn_Cancel,
      confirmButtonText: btnAceptxt,
      cancelButtonText: 'Cancelar',
    }).then((result) => {

      if (result.isConfirmed) {

        window.location.reload();

      } else if (result.isDismissed) {

        console.log('Clicked No, File is safe!');

      }
    })
  }else{
    Swal.fire({
      title: titulo,
      text: texto,
      icon: tipo,
      showCancelButton: sn_Cancel,
      confirmButtonText: btnAceptxt,
      cancelButtonText: 'Cancelar',
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: 'Alert',
          text: txtSecondDialog,
          icon: 'success',
          confirmButtonText: 'Ok',

        }).then((result) => {
    
          if (result.isConfirmed) {
    
            window.location.reload();
    
          } 
        })
        

      } else if (result.isDismissed) {

        console.log('Clicked No, File is safe!');

      }
    })

  }
}



}

