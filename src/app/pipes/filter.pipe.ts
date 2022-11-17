import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultUsuarios = [];
    for(const usuario of value){
      if(usuario.nombre.indexOf(arg) > -1){
        resultUsuarios.push(usuario);
      };
    };
    return resultUsuarios;
  }

}
