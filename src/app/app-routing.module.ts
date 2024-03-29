import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'notification-permission',
    loadChildren: () => import('./registro/entrenante/notification-permission/notification-permission.module').then( m => m.NotificationPermissionPageModule)
  },
  {
    path: 'profile-basic',
    loadChildren: () => import('./registro/profile-basic/profile-basic.module').then( m => m.ProfileBasicPageModule)
  },
  {
    path: 'gender',
    loadChildren: () => import('./registro/gender/gender.module').then( m => m.GenderPageModule)
  },
  {
    path: 'brithday',
    loadChildren: () => import('./registro/brithday/brithday.module').then( m => m.BrithdayPageModule)
  },
  {
    path: 'w-and-h',
    loadChildren: () => import('./registro/entrenante/w-and-h/w-and-h.module').then( m => m.WAndHPageModule)
  },
  {
    path: 'exercise-frequency',
    loadChildren: () => import('./registro/entrenante/exercise-frequency/exercise-frequency.module').then( m => m.ExerciseFrequencyPageModule)
  },
  {
    path: 'objetive',
    loadChildren: () => import('./registro/entrenante/objetive/objetive.module').then( m => m.ObjetivePageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./registro/password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'profession',
    loadChildren: () => import('./registro/entrenante/profession/profession.module').then( m => m.ProfessionPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'select',
    loadChildren: () => import('./registro/select/select.module').then( m => m.SelectPageModule)
  },
  {
    path: 'specialty',
    loadChildren: () => import('./registro/entrenador/specialty/specialty.module').then( m => m.SpecialtyPageModule)
  },
  {
    path: 'additional',
    loadChildren: () => import('./registro/entrenador/additional/additional.module').then( m => m.AdditionalPageModule)
  },
  {
    path: 'tariff',
    loadChildren: () => import('./registro/entrenador/tariff/tariff.module').then( m => m.TariffPageModule)
  },
  {
    path: 'resume',
    loadChildren: () => import('./registro/entrenador/resume/resume.module').then( m => m.ResumePageModule)
  },
  {
    path: 'register-finished-trainer',
    loadChildren: () => import('./registro/entrenador/register-finished-trainer/register-finished-trainer.module').then( m => m.RegisterFinishedTrainerPageModule)
  },
  {
    path: 'activate-entrenadores',
    loadChildren: () => import('./contenido/managerAdministradores/activate-entrenadores/activate-entrenadores.module').then( m => m.ActivateEntrenadoresPageModule)
  },
  {
    path: 'notactivate',
    loadChildren: () => import('./contenido/managerAdministradores/notactivate/notactivate.module').then( m => m.NotactivatePageModule)
  },
  {
    path: 'errorpage',
    loadChildren: () => import('./contenido/managerAdministradores/errorpage/errorpage.module').then( m => m.ErrorpagePageModule)
  },
  {
    path: 'perfile',
    loadChildren: () => import('./contenido/perfile/perfile.module').then( m => m.PerfilePageModule)
  },
  {
    path: 'videos',
    loadChildren: () => import('./contenido/managerMultimedia/videos/videos.module').then( m => m.VideosPageModule)
  },
  {
    path: 'errorvideos',
    loadChildren: () => import('./contenido/managerMultimedia/errorvideos/errorvideos.module').then( m => m.ErrorvideosPageModule)
  },
  {
    path: 'crear-ejercicio',
    loadChildren: () => import('./contenido/managerMultimedia/crear-ejercicio/crear-ejercicio.module').then( m => m.CrearEjercicioPageModule)
  },
  {
    path: 'crear-tipo-ejercicio',
    loadChildren: () => import('./contenido/managerMultimedia/crear-tipo-ejercicio/crear-tipo-ejercicio.module').then( m => m.CrearTipoEjercicioPageModule)
  },
  {
    path: 'crear-objetivo-muscular',
    loadChildren: () => import('./contenido/managerMultimedia/crear-objetivo-muscular/crear-objetivo-muscular.module').then( m => m.CrearObjetivoMuscularPageModule)
  },
  {
    path: 'crear-multimedia',
    loadChildren: () => import('./contenido/managerMultimedia/crear-multimedia/crear-multimedia.module').then( m => m.CrearMultimediaPageModule)
  },
  {
    path: 'control-multimedia',
    loadChildren: () => import('./contenido/managerMultimedia/control-multimedia/control-multimedia.module').then( m => m.ControlMultimediaPageModule)
  },
  {
    path: 'control-programacion',
    loadChildren: () => import('./contenido/managerSesiones/control-programacion/control-programacion.module').then( m => m.ControlProgramacionPageModule)
  },
  {
    path: 'error-sesiones',
    loadChildren: () => import('./contenido/managerSesiones/error-sesiones/error-sesiones.module').then( m => m.ErrorSesionesPageModule)
  },
  {
    path: 'crear-erequerido',
    loadChildren: () => import('./contenido/managerMultimedia/crear-erequerido/crear-erequerido.module').then( m => m.CrearERequeridoPageModule)
  },
  {
    path: 'crear-rutinas',
    loadChildren: () => import('./contenido/managerSesiones/crear-rutinas/crear-rutinas.module').then( m => m.CrearRutinasPageModule)
  },
  {
    path: 'crear-sesiones',
    loadChildren: () => import('./contenido/managerSesiones/crear-sesiones/crear-sesiones.module').then( m => m.CrearSesionesPageModule)
  },
  {
    path: 'sesiones',
    loadChildren: () => import('./contenido/managerSesiones/sesiones/sesiones.module').then( m => m.SesionesPageModule)
  },
  {
    path: 'rutinas',
    loadChildren: () => import('./contenido/managerSesiones/rutinas/rutinas.module').then( m => m.RutinasPageModule)
  },
  {
    path: 'users-trainers',
    loadChildren: () => import('./contenido/managerUsers/users-trainers/users-trainers.module').then( m => m.UsersTrainersPageModule)
  },
  {
    path: 'error-page-users-trainers',
    loadChildren: () => import('./contenido/managerUsers/error-page-users-trainers/error-page-users-trainers.module').then( m => m.ErrorPageUsersTrainersPageModule)
  },
  {
    path: 'error-users',
    loadChildren: () => import('./error-users/error-users.module').then( m => m.ErrorUsersPageModule)
  },
  {
    path: 'contrato-entrenador',
    loadChildren: () => import('./contenido/managerUsers/contrato-entrenador/contrato-entrenador.module').then( m => m.ContratoEntrenadorPageModule)
  },
  {
    path: 'listar-ejercicios',
    loadChildren: () => import('./contenido/managerUsers/listar-ejercicios/listar-ejercicios.module').then( m => m.ListarEjerciciosPageModule)
  },
  {
    path: 'listar-parametros',
    loadChildren: () => import('./contenido/managerUsers/listar-parametros/listar-parametros.module').then( m => m.ListarParametrosPageModule)
  },
  {
    path: 'listar-sesiones',
    loadChildren: () => import('./contenido/managerUsers/listar-sesiones/listar-sesiones.module').then( m => m.ListarSesionesPageModule)
  },
  {
    path: 'rutinas-diarias',
    loadChildren: () => import('./contenido/managerUsers/rutinas-diarias/rutinas-diarias.module').then( m => m.RutinasDiariasPageModule)
  },
  {
    path: 'programarrutinas',
    loadChildren: () => import('./contenido/managerUsers/programarrutinas/programarrutinas.module').then( m => m.ProgramarrutinasPageModule)
  },
  {
    path: 'listar-guardados',
    loadChildren: () => import('./contenido/managerUsers/listar-guardados/listar-guardados.module').then( m => m.ListarGuardadosPageModule)
  },
  {
    path: 'ejercicio-uniq',
    loadChildren: () => import('./contenido/managerEjercicio/ejercicio-uniq/ejercicio-uniq.module').then( m => m.EjercicioUniqPageModule)
  },
  {
    path: 'data-entrenador',
    loadChildren: () => import('./contenido/managerUsers/data-entrenador/data-entrenador.module').then( m => m.DataEntrenadorPageModule)
  },
  {
    path: 'listar-ejercicios-all',
    loadChildren: () => import('./contenido/managerUsers/listar-ejercicios-all/listar-ejercicios-all.module').then( m => m.ListarEjerciciosAllPageModule)
  },  {
    path: 'listar-rutinas-diarias',
    loadChildren: () => import('./contenido/managerUsers/listar-rutinas-diarias/listar-rutinas-diarias.module').then( m => m.ListarRutinasDiariasPageModule)
  },
  {
    path: 'listar-programas-rutinas',
    loadChildren: () => import('./contenido/managerUsers/listar-programas-rutinas/listar-programas-rutinas.module').then( m => m.ListarProgramasRutinasPageModule)
  },
  {
    path: 'listar-rutinas-all',
    loadChildren: () => import('./contenido/managerUsers/listar-rutinas-all/listar-rutinas-all.module').then( m => m.ListarRutinasAllPageModule)
  },
  {
    path: 'listar-sesiones-all',
    loadChildren: () => import('./contenido/managerUsers/listar-sesiones-all/listar-sesiones-all.module').then( m => m.ListarSesionesAllPageModule)
  },
  {
    path: 'video-uniq',
    loadChildren: () => import('./contenido/managerEjercicio/video-uniq/video-uniq.module').then( m => m.VideoUniqPageModule)
  },
  {
    path: 'half-time',
    loadChildren: () => import('./contenido/managerEjercicio/half-time/half-time.module').then( m => m.HalfTimePageModule)
  },
  {
    path: 'informe-usuario',
    loadChildren: () => import('./contenido/managerInforme/informe-usuario/informe-usuario.module').then( m => m.InformeUsuarioPageModule)
  },
  {
    path: 'hash-account',
    loadChildren: () => import('./hash-account/hash-account.module').then( m => m.HashAccountPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
