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
  allPeople(): Observable<any> {
    return this.http.get(IP_ADDRESS+/profiles/);
  }
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
  allprofesion():Observable<any>{
    return this.http.get(this.apiUrl+/profesion/);
  }
  allObtenerRolUsers():Observable<any>{
    return this.http.get(this.apiUrl+/rolUsers/);
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
  allEntrenantes(): Observable<any> {
    return this.http.get(IP_ADDRESS+/manager/+/entrenante/ );
  }
  allGender(): Observable<any> {
    return this.http.get(this.apiUrl+/genero/);
  }
  UpdatePersona(data:any): Observable<any>{
    console.log(data);
    return this.http.post(this.apiUrl+"/updatePersona",data);
  }
  UpdateEntrenantes(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/updateEntrenante",data);
  }
  UpdateEntrenador(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/updateEntrenador",data);
  }
  UpdateEntrenadorActivacion(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+/manager/+/activacion/+data.IDENTRENADOR,data );
  }
  UpdatePersonaEstado(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+/manager/+/estado/+data.IDPERSONA,data );
  }
  PerfileUniq(nickname:string): Observable<any>{
    return this.http.post(IP_ADDRESS+/profiles/+nickname,{})};
  UpdateProfileBasic(data:any):Observable<any>{
    return this.http.post(IP_ADDRESS+/manager/+/perfile/+data.IDPERSONA,data );
  }
  getPasswordHash(nickname:string):Observable<any>{
    return this.http.get(this.apiUrl+/passwordHash/+nickname);
  }
  getMultimedia():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/);
  }
  getEquipoRequerido():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/+/equiporequerido/);
  }
  getTipoEjercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/+/tipoejercicio/);
  }
  getObjetivosMusculares():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/+/tipoejercicio/);
  }
  getEjercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/+/ejercicio/);
  }
  getPreEjercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/+/preejercicio/);
  }
  getNivelDificultaDejercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+/multimedia/+/niveldificultadejercicio/);
  }
  UpdateEjercicioEstado(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+/multimedia/+/estado/+data.IDEJERCICIO,data );
  }
}
