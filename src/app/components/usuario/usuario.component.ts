import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  baseUrl = "https://prueba-usuario.herokuapp.com/";

  usuario: FormGroup;
  submitted:boolean = false;
  isActive: string;

  filterUsuario = "";
  listUsuario: any[];
  listRol: any;

  constructor(private httpClient: HttpClient, private modal:NgbModal, private formBuilder: FormBuilder) { 
  }

  ngOnInit(){
    this.httpClient.get(this.baseUrl + 'usuario/usuarios').subscribe(
      (response) => {
        this.listUsuario = Object.values(response);
      },
      (error) => console.log("Error mostrando los usuarios: " + error.value)
    );

    this.httpClient.get(this.baseUrl + 'rol/roles').subscribe(
      (response) => {
        this.listRol = response
      },
      (error) => console.log("Error mostrando los roles: " + error.value)
    );

    this.usuario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9 ]{4,50}")]],
      rol: ['', Validators.required],
      active: ['', Validators.required]
    })
  }

  get f() { return this.usuario.controls; }

  onSubmit(){
    this.submitted = true;
    if(this.usuario.invalid){
      return;
    }else{
      this.httpClient.post(this.baseUrl + 'usuario/create', this.mapperModeloUsuario()).subscribe((response) =>{
        if(response){
          Swal.fire(
            'Registro con exito',
            'El Registro se ha hecho con exito',
          );
          window.location.reload();
        }else{
          Swal.fire(
            'Registro fallado, por favor revise los campos'
          );
        }
      });
    }
  }

  onSubmitEdit(){
    this.submitted = true;
    if(this.usuario.invalid){
      return;
    }else{
      this.httpClient.put(this.baseUrl + 'usuario/modified', this.mapperModeloUsuarioEdit()
      ).subscribe((response) =>{
        if(response){
          Swal.fire(
            'Editado con exito',
            'Se ha editado con exito',
          );
          window.location.reload();
        }else{
          Swal.fire(
           'Ha fallado la edición, por favor revise los campos'
          );
        }   
      })
    }
  }

  cancelModal(){
    Swal.fire({
      text: '¿Desea cancelar el proceso?, recuerde que perdera todos los datos ingresados',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed){
        this.modal.dismissAll();
        this.usuario.reset();
    }else{
    }})
  }

  crearUsuario(){
    Swal.fire({
      title: 'Registrar Usuario',
      text: '¿Desea registrar un nuevo usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Registro Cancelado',
          'El registro no se ha completado',
          'error'
        );
      }
    });
  }

  editarUsuario(){
    Swal.fire({
      title: 'Editar Usuario',
      text: '¿Desea editar el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
          this.onSubmitEdit();
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Editar Cancelado',
          'La edición no se ha completado',
          'error'
        );
      }
    });
  }

  eliminarUsuario(idUsuario:any){
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
      this.httpClient.delete(this.baseUrl + 'usuario/delete/'+ idUsuario).subscribe(
        (response) => {
          console.log(response);
          if(response){
            Swal.fire(
              'Eliminado con exito',
              'Se ha eliminado el usuario con exito'
            )
            window.location.reload();
          }
        },
        (error) => {
          Swal.fire(
            'Proceso fallido',
            'El usuario no se ha podido eliminar'
          )});
      }
      else if (result.isDenied) {
        Swal.fire(
          'Eliminar Cancelado',
          'La eliminación del registro no se ha completado',
          'error'
        )}
    });
  }

  openModalCreate(template: TemplateRef<any>){
    this.modal.open(template);
  }

  openModalEdit(template: TemplateRef<any>, usuario:any){
    this.usuario = this.formBuilder.group({
      idUsuario: [usuario.idUsuario, Validators.required],
      nombre: [usuario.nombre, [Validators.required, Validators.pattern("[a-zA-Z0-9 ]{4,50}")]],
      rol: [usuario.rol.nombre, Validators.required],
      active: [usuario.activo, Validators.required]
    });
    this.modal.open(template);
  }

  mapperModeloUsuario(){
    return{
      idUsuario: this.usuario.value.idUsuario,
      rol: {
        idRol: this.usuario.value.rol
      },
      nombre: this.usuario.value.nombre,
      activo: this.usuario.value.active,
    }
  }
  mapperModeloUsuarioEdit(){
    return{
      idUsuario: this.usuario.value.idUsuario,
      rol: {
        nombre: this.usuario.value.rol
      },
      nombre: this.usuario.value.nombre,
      activo: this.usuario.value.active,
    }
  }
}
