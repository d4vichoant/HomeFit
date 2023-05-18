import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IP_ADDRESS } from './constantes';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = IP_ADDRESS+'/profiles';

  constructor(private http: HttpClient) { }

  saveProfile(data: any): Observable<any> {
    return this.http.post(this.apiUrl+"/guardarDatos", data);
  }
  saveProfileTrainer(data: any): Observable<any> {
    return this.http.post(this.apiUrl+"/guardarDatosEntrenador", data);
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
  uploadFile(file: File,nickname: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,nickname);
    return this.http.post(this.apiUrl + '/subir-archivo', formData);
  }
  protectedRequestWithToken( token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(IP_ADDRESS+'/protectedtoken', { headers });
  }
  allTrainer(): Observable<any> {
    return this.http.get(IP_ADDRESS+/manager/);
  }
}
