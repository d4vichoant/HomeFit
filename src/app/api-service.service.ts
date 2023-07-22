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
    return this.http.get(IP_ADDRESS+'/profiles/');
  }
  saveProfile(data: any): Observable<any> {
    return this.http.post(this.apiUrl+"/guardarDatos", data);
  }
  saveProfileTrainer(data: any): Observable<any> {
    return this.http.post(this.apiUrl+"/guardarDatosEntrenador", data);
  }
  connsultPerfilCompleto(nickname:string): Observable<any>{
    return this.http.post(this.apiUrl+"/"+nickname,"");
  }
  connsultPerfilUsuarioCompleto(nickname:string): Observable<any>{
    return this.http.post(this.apiUrl+"/usuarioFind/"+nickname,"");
  }
  consultLogin(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/login",data);
  }
  checkNickname(nickname: string):Observable<any>{
    return this.http.get(this.apiUrl+'/check-nickname/'+nickname);
  }
  checkMail(mail: string):Observable<any>{
    return this.http.get(this.apiUrl+'/check-mail/'+mail);
  }
  allfrecuenciaejercicio():Observable<any>{
    return this.http.get(this.apiUrl+'/frecuenciaejercicio/');
  }
  allprofesion():Observable<any>{
    return this.http.get(this.apiUrl+'/profesion/');
  }
  allObtenerRolUsers():Observable<any>{
    return this.http.get(this.apiUrl+'/rolUsers/');
  }
  allObjetivosPersonales():Observable<any>{
    return this.http.get(this.apiUrl+'/objetivospersonales/');
  }
  allobjetivospersonalesusuario(idUsuario:number):Observable<any>{
    return this.http.get(this.apiUrl+'/objetivospersonalesusuario/'+idUsuario);
  }
  allEquipoRequerido():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/equiporequerido/');
  }
  allEquipoRequeridoActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/equiporequeridoActivate/');
  }
  allMet():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/met/');
  }
  allEspecialidadentrenador():Observable<any>{
    return this.http.get(this.apiUrl+'/especialidadentrenador/');
  }
  getcomentariosentrenador(idEntrenador:number):Observable<any>{
    return this.http.get(this.apiUrl+'/getcomentariosentrenador/'+idEntrenador);
  }
  insertarcomentarioentrenador(IDUSUARIO:number,IDENTRENADOR:number,PUNTUACIONCOMENTARIOENTRENADOR:number,OPINIONCOMENTARIOENTRENADOR:string):Observable<any>{
    const data={
      IDUSUARIO:IDUSUARIO,
      IDENTRENADOR:IDENTRENADOR,
      PUNTUACIONCOMENTARIOENTRENADOR:PUNTUACIONCOMENTARIOENTRENADOR,
      OPINIONCOMENTARIOENTRENADOR:OPINIONCOMENTARIOENTRENADOR
    }
    return this.http.post(this.apiUrl+'/insertarcomentarioentrenador/',data);
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
    return this.http.get(IP_ADDRESS+'/manager/');
  }
  allTrainerBasic(): Observable<any> {
    return this.http.get(IP_ADDRESS+'/manager/entrenadorBasic/');
  }
  allTrainerBasicEjercicioRutina(): Observable<any> {
    return this.http.get(IP_ADDRESS+'/manager/entrenadorBasicEjercicioRutina/');
  }
  allEntrenantes(): Observable<any> {
    return this.http.get(IP_ADDRESS+'/manager/entrenante/ ');
  }
  allGender(): Observable<any> {
    return this.http.get(this.apiUrl+'/genero/');
  }
  UpdatePersona(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/updatePersona",data);
  }
  UpdateEntrenantes(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/updateEntrenante",data);
  }
  UpdateEntrenador(data:any): Observable<any>{
    return this.http.post(this.apiUrl+"/updateEntrenador",data);
  }
  UpdateEntrenadorActivacion(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/manager/activacion/'+data.IDENTRENADOR,data );
  }
  UpdatePersonaEstado(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/manager/estado/'+data.IDPERSONA,data );
  }
  PerfileUniq(nickname:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/profiles/'+nickname,{})};
  UpdateProfileBasic(data:any):Observable<any>{
    return this.http.post(IP_ADDRESS+'/manager/perfile/'+data.IDPERSONA,data );
  }
  getPasswordHash(nickname:string):Observable<any>{
    return this.http.get(this.apiUrl+'/passwordHash/'+nickname);
  }
  getMultimedia():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/');
  }
  getMultimediaActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/multimediaActivate/');
  }
  getTipoEjercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/tipoejercicio/');
  }
  getTipoEjercicioActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/tipoejercicioActivate/');
  }
  getObjetivosMusculares():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/objetivosmusculares/');
  }
  getObjetivosMuscularesActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/objetivosmuscularesActivate/');
  }
  getEjercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/ejercicio/');
  }
  getEjercicioActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/ejercicioActivate/');
  }
  getEjercicioActivateIdEjercicio(idEjercicio:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/ejercicioActivate/'+idEjercicio);
  }
  getPreEjercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/preejercicio/');
  }
  getNivelDificultaDejercicio():Observable<any>{
    return this.http.get(IP_ADDRESS+'/multimedia/niveldificultadejercicio/');
  }
  UpdateEjercicioEstado(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/estado/'+data.IDEJERCICIO,data );
  }
  UpdatePassword(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/manager/updatepassword/',data );
  }
  UpdataStatus(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/chanceActivacion/'+nombre,data );
  }
  UpdataData(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/UpdateData/'+nombre,data );
  }
  CreteData(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/CreateData/'+nombre,data );
  }
  UpdataDataMultimedia(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/UpdateDataMultimedia/'+nombre,data );
  }
  CreteDataMultimedia(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/CreateDataMultimedia/'+nombre,data );
  }
  UpdataDataERequerido(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/UpdateDataERequerido/'+nombre,data );
  }
  CreateDataERequerido(data:any,nombre:string): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/CreateDataERequerido/'+nombre,data );
  }
  uploadFileMp3(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-archivo', formData);
  }
  uploadcaptureImagen(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-imagen', formData);
  }
  uploadcaptureImagenRutinas(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-imagen-rutinas', formData);
  }
  uploadcaptureImagenSesiones(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-imagen-sesiones', formData);
  }
  uploadcaptureImagenTipoEjercicio(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-imagen-tipoEjercicio', formData);
  }
  uploadcaptureImagenOMuscular(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-imagen-objetivomuscular', formData);
  }
  uploadcaptureImagenERequerido(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(IP_ADDRESS + '/multimedia/subir-imagen-erequerido', formData);
  }
  uploadImagenPerfile(file: File,filename :string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file,filename);
    return this.http.post(this.apiUrl+ "/subir-imagen-perfile", formData);
  }
  uploadImagenPerfileText(imagepersona:string,idpersona:number): Observable<any>{
    const data={
      IMAGEPERSONA:imagepersona,
      IDPERSONA:idpersona
    }
    return this.http.post(this.apiUrl+"/uploadImagenPerfileText/",data );
  }
  CreteDatEjercicio(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/CreateDataEjercicio/',data );
  }
  UpdateEjercicio(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/multimedia/UpdateDataEjercicio/',data );
  }
  ObtenerComentarioPorEjercicio(idEjercicio:number){
    return this.http.get(IP_ADDRESS+'/multimedia/obtenerComentariosporEjercicio/'+idEjercicio);
  }
  insertarCalificaionEjercicio(data:any){
    return this.http.post(IP_ADDRESS+'/multimedia/insertarCalificaionEjercicio/',data);
  }
  CreteDataRutinas(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/CreateDataRutina/',data );
  }
  UpdateDataRutinas(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/UpdateDataRutina/',data );
  }
  CreteDataSesion(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/CreateDataSesion/',data );
  }
  UpdateDataSesion(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/UpdateDataSesion/',data );
  }
  getRutinas():Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/rutinas/');
  }
  getRutinasActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/rutinasActivate/');
  }
  getRutinasActivateIdRutinas(idRutina:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/rutinasActivate/'+idRutina);
  }
  getRutinasActivatebyObjetive(idObjetive:Number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/rutinasActivatebyObjetive/'+idObjetive);
  }
  imagenEntrenadorRutina():Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/imagePorEntrenadorRutina/');
  }
  imagenEntrenadorSesion():Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/imagePorEntrenadorSesion/');
  }
  copyPortadasRutinas(oldnameFile:string,newnameFile:string):Observable<any>{
    const data={
      oldnameFile:oldnameFile,
      newnameFile:newnameFile
    }
    return this.http.post(IP_ADDRESS+'/multimedia/copyFiles-portadassesiones/',data );
  }
  getSesiones():Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/sesiones/');
  }
  getSesionesActivate():Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/sesionesActivate/');
  }
  getSesionesActivateidSesion(idSesion:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/sesionesActivate/'+idSesion);
  }
  allBookmark(type: string): Observable<any> {
    const apiUrlWithType = this.apiUrl + '/' + type + '/';
    return this.http.get(apiUrlWithType);
  }
  updateBookmarkpersona(idEjercicio: number, idPersona: number, status: boolean, type: string): Observable<any> {
    const data = {
      IDEJERCICIO: idEjercicio,
      IDPERSONA: idPersona,
      STATUSBOOKMARK: status
    };
    const apiUrlWithType = this.apiUrl + '/' + type + '/';
    return this.http.post(apiUrlWithType, data);
  }
  ContratoEntrenador(idUSUARIO: number, idENTRENADOR: number,MESESCONTRATACION:number): Observable<any>{
    const data={
      idUSUARIO:idUSUARIO,
      idENTRENADOR:idENTRENADOR,
      MESESCONTRATACION:MESESCONTRATACION,
    }
    return this.http.post(IP_ADDRESS+'/programacion/Contrato/',data );
  }
  obtenerContratoUsuario(idUsuario:number,idEntrenador:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/obtenerContratoUsuario/'+idUsuario+'/'+idEntrenador);
  }
  obtenerContratoUsuarioPorEntrenador(idEntrenador:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/obtenerContratoUsuarioPorEntrenador/'+idEntrenador);
  }
  addespecialidadentrenadorentrenador(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/addespecialidadentrenadorentrenador/',data );
  }
  addespecialidadentrenador(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/addespecialidadentrenador/',data );
  }
  obtenerContratoEntrenadoresUsuario(idUsuario:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/obtenerContratoEntrenadoresUsuario/'+idUsuario);
  }
  obtenercontarTypes(nombreTabla:string):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/contarTypes/'+nombreTabla);
  }
  createDataProgresoUsuario(data:any): Observable<any>{
    return this.http.post(IP_ADDRESS+'/programacion/createDataProgresoUsuario/',data );
  }
  changeShowProgresoUsuario(idprogresoUsuario:number,progress_show:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/changeShowProgresoUsuario/'+idprogresoUsuario+'/'+progress_show);
  }
  obtenerProgresousuario(IDUSUARIO:number):Observable<any>{
    return this.http.get(IP_ADDRESS+'/programacion/obtenerProgresousuario/'+IDUSUARIO);
  }
  obtenerPesoAltura(IDUSUARIO:number):Observable<any>{
    return this.http.get(this.apiUrl+'/obtenerPesoAltura/'+IDUSUARIO);
  }
  actualizarPesoAltura(IDUSUARIO:number,data:any):Observable<any>{
    return this.http.post(this.apiUrl+'/actualizarPesoAltura/'+IDUSUARIO,data);
  }
  obtenerPesoHistory(IDUSUARIO:number):Observable<any>{
    return this.http.get(this.apiUrl+'/obtenerPesoHistory/'+IDUSUARIO);
  }
  obtenerInformeBasic(IDUSUARIO:number):Observable<any>{
    return this.http.get(this.apiUrl+'/obtenerInformeBasic/'+IDUSUARIO);
  }
}
