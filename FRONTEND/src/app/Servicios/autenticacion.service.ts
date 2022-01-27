import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private http: HttpClient) { }

  headers: HttpHeaders=new HttpHeaders({
    "Content-Type":"application/json"//tipo de dato que se va a estar enviando(json)
  })

  
  activarkey(nickname:string){

    const url='http://localhost:3700/api/v1/usuarios/activarkey';

    return this.http.post(
      url,
      {
        "nickname":nickname
      },
      { headers: this.headers }
    ).pipe(map(data => data));


  }

  desactivarkey(nickname:string){

    const url='http://localhost:3700/api/v1/usuarios/desactivarkey';

    return this.http.post(
      url,
      {
        "nickname":nickname
      },
      { headers: this.headers }
    ).pipe(map(data => data));


  }

  generarkey(nickname:string){

    const url='http://localhost:3700/api/v1/usuarios/generarkey';

    return this.http.post(
      url,
      {
        "nickname":nickname
      },
      { headers: this.headers }
    ).pipe(map(data => data));


  }

  validarkey(nickname:string,token:string){

    const url='http://localhost:3700/api/v1/usuarios/validarkey';

    return this.http.post(
      url,
      {
        "nickname":nickname,
	      "token": token
      },
      { headers: this.headers }
    ).pipe(map(data => data));


  }

  sendemail(correo:string,key:string){

    const url='http://localhost:3700/api/v1/usuarios/sendemail';

    return this.http.post(
      url,
      {
        "correo":correo,
      	"key":key
      },
      { headers: this.headers }
    ).pipe(map(data => data));


  }

}
