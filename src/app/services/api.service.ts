import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ruta: string = 'https://www.programadormaldito.cl/API_PRODUCTO/api-service.php'

  constructor(private http: HttpClient) { }

  productoListar() {
  return this.http.get(this.ruta + '?nombreFuncion=ProductoListar').pipe();
  }

  productoAlmacenar(codigo: string, nombre: string, descripcion: string, precio: number){
  return this.http.post(this.ruta, {
    nombreFuncion: "ProductoAlmacenar",
    parametros: [
      codigo, nombre, descripcion, precio
    ]
  }).pipe();
  }
}
