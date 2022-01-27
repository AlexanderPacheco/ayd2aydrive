import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import {Observable} from "rxjs";
import { LoginService } from "../Servicios/login.service"
import  { Persona } from "../models/InfP";
import * as CryptoJS from 'crypto-js';
//import { env } from 'process';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  Usuario: Persona = {

  nickname : "",
  correo: "",
  fechaNacimiento:"",
  contrasena:"",
  }

  secretKey = environment.LLAVE_ENCRIPTACION;

  constructor(private http: HttpClient, private usuario: LoginService) { }

  headers: HttpHeaders=new HttpHeaders({
    "Content-Type":"application/json"//tipo de dato que se va a estar enviando(json)
  })

  public apiUrl: string = environment.API_REGISTRO_USUARIO;
  public editarUrl: string= environment.API_EDITAR_CARPETA;
  public listarUrl: string= environment.API_LISTAR_CARPETA;
  public logsUrl: string = environment.API_LISTAR_REPORTE;


  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  listarReporte(){
    return this.http.get(this.logsUrl);
  }


  validar_existencia(nickname:string){

    //const url="http://localhost:3700/users/validar";
    //const url="http://localhost:3700/api/v1/validar";
    //const url=this.apiUrl;
    const url2=`${this.apiUrl}/validar/${nickname}`;

    return this.http.get(url2);

  }

  registrar_usuario(nickname:string,correo:string,fechaNacimiento:string,contrasena:string){

    //const url="http://localhost:3700/api/v1/usuarios/";
    const url=this.apiUrl+'/usuarios';
    return this.http.post(
        url,
        {
          "nickname": nickname,
          "correo": correo,
          "fechaNacimiento": fechaNacimiento,
          "contrasena": contrasena,
          "workspace": {
            "carpetas": [ ],
            "archivos":[ ]
          }

        },
        { headers: this.headers }
      ).pipe(map(data => data));

    }


    listarCarpeta(nickname:string){
      //const url="http://localhost:3400/users/listarcarpetas";
      //http://localhost:3000/listarcarpeta/func/g2/listarcarpetas/:nickname
      const new_url=`${this.listarUrl}/listarcarpetas/${nickname}`;
      return this.http.get(new_url);
    }

    editarnombreCarpeta(nickname:string,nomcarpeta:string,nuevonombre:string){
      //const url="http://localhost:3300/func/g2/editarcarpeta";

      const new_url=`${this.editarUrl}/editarcarpeta/${nickname}/${nomcarpeta}`;

      return this.http.post(
        new_url,
        {
          "nuevo_nombre":nuevonombre
        },
        { headers: this.headers }

        ).pipe(map(data => data));

    }

    listarArchivo(nickname:string,carpeta:string){
      //const url="http://localhost:3000/ListaArchivos/all";
      const url = environment.API_SERV3;
      var new_url=""
      const root="root"
      if(carpeta==""){
        console.log("entra");
        new_url=`${url}/${nickname}/${root}`;
      }else{
        new_url=`${url}/${nickname}/${carpeta}`;
      }

      return this.http.get(new_url);
    }

  listarArchivoEliminados(nickname:string,carpeta:string){
    //const url="http://localhost:3000/ListaArchivos/eliminados";
    const url = environment.API_SERV5;
    var new_url=""
    const root="root"
    if(carpeta==""){
      console.log("entra");

      new_url=`${url}/${nickname}/${root}`;
    }else{
      new_url=`${url}/${nickname}/${carpeta}`;
    }
    console.log(new_url);
    return this.http.get(new_url);
  }

  eliminacionDefinitiva(nickname:string,carpeta:string,linkUnico:string){
    //const url="http://localhost:3000/ListaArchivos/eliminaciondef";
    const url = environment.API_SERV6;
    var new_url=""
    const root="root"
    if(carpeta==""){
      console.log("entra");

      new_url=`${url}/${nickname}/${linkUnico}`;
    }else{
      new_url=`${url}/${nickname}/${linkUnico}`;
    }
    console.log(new_url);
    return this.http.get(new_url);
  }

  restauracion(nickname:string,carpeta:string,linkUnico:string){
    //const url="http://localhost:3000/ListaArchivos/restaurar";
    const url = environment.API_SERV7;
    var new_url=""
    const root="root"
    if(carpeta==""){
      console.log("entra restauracion");

      new_url=`${url}/${nickname}/${linkUnico}`;
    }else{
      new_url=`${url}/${nickname}/${linkUnico}`;
    }
    console.log(new_url);
    return this.http.get(new_url);
  }


  crearCarpeta(carpeta:string){
    //const url="http://localhost:3000/CrearCarpetas/ccarpeta";
    const url=environment.API_SERV4;
    var new_url=""
    this.Usuario = this.usuario.getLocalS();
    var nUser = this.Usuario.nickname;
    new_url=`${url}/${nUser}/${carpeta.toString()}`;

    return this.http.post(
      new_url,
      {
        "carpeta":carpeta,
      },
      { headers: this.headers }

    ).pipe(map(data => data));
  }



}
