import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { async, lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
})
export class CrearProductoPage implements OnInit {

  mdl_codigo: string = '';
  mdl_nombre: string = '';
  mdl_descripcion: string = '';
  mdl_precio: string = '';

  constructor(private api : ApiService, private router: Router) { }

  ngOnInit() {
  }

async productoAlmacenar(){
    let datos_espera = this.api.productoAlmacenar(
      this.mdl_codigo, this.mdl_nombre, this.mdl_descripcion, Number(this.mdl_precio)
    );
    let datos = await lastValueFrom(datos_espera);

    let json_texto = JSON.stringify(datos);
    let json = JSON.parse(json_texto);

    if(json['result'][0].RESPUESTA == 'OK') {
      this.router.navigate(['principal'], {replaceUrl: true})
    } else {
      console.log('SGA: ' +json_texto)
    }
  }
}
