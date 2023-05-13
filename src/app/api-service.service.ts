import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = 'http://192.168.100.55:9600/profiles';

  constructor(private http: HttpClient) { }

  saveProfile(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  consultLogin(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/login",data);
  }

  checkNickname(nickname: string):Observable<any>{
    return this.http.get(this.apiUrl+/check-nickname/+nickname);
  }
  checkMail(mail: string):Observable<any>{
    return this.http.get(this.apiUrl+/check-mail/+mail);
  }
  allfrecuenciaejercicio():Observable<any>{
    return this.http.get(this.apiUrl+/frecuenciaejercicio/);
  }
  allObjetivosPersonales():Observable<any>{
    return this.http.get(this.apiUrl+/OBJETIVOSPERSONALES/);
  }
  allEspecialidadentrenador():Observable<any>{
    return this.http.get(this.apiUrl+/especialidadentrenador/);
  }
}
