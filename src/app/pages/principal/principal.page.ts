import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}

interface UsuarioData {
  usuario?: string;
  contrasena?: string;
  correo?: string;
  nombre?: string;
  apellido?: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  usuario: string = '';
  contrasena: string = '';

  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  contrasena2: string = '';

lista_productos: any[] = [];

  constructor(private router: Router, private db: DbService, private api: ApiService) { }

  ngOnInit() {
    let extras = this.router.getCurrentNavigation();
    if (extras?.extras.state) {
      this.usuario = extras?.extras.state['usuario'];
      this.contrasena = extras?.extras.state['contrasena'];
    }

    console.log('SGA: sesión: ' + this.usuario);

    if (this.usuario == '') {
      console.log('SGA: ACÁ');
      this.db.obtenerSesion().then((data: UsuarioData) => {
        this.usuario = data.usuario || '';
        this.contrasena = data.contrasena || '';
        this.infoUsuario();
      });
    } else {
      this.infoUsuario();
    }

    this.productoListar();
  }

  infoUsuario() {
    this.db.infoUsuario(this.usuario, this.contrasena)
      .then((data: UsuarioData) => {
        this.correo = data.correo || '';
        this.nombre = data.nombre || '';
        this.apellido = data.apellido || '';
        this.contrasena2 = data.contrasena || '';
      });
  }

  navegarCambiarContrasena() {
    let extras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        contrasena: this.contrasena
      },
      replaceUrl: true
    }
    this.router.navigate(['cambiar-contrasena'])
  }

  cerrarSesion() {
    this.db.eliminarSesion();
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['login'], extras);
  }

  async productoListar() {
    let datos_espera = this.api.productoListar();
    let datos = await lastValueFrom(datos_espera);

    let json_texto = JSON.stringify(datos);
    let json = JSON.parse(json_texto);

    for(let x = 0; x < json['result'].lenght; x++) {
    let producto: any = {};
    producto.codigo = json['result'][x].CODIGO;
    producto.nombre = json['result'][x].NOMBRE;
    producto.descripcion = json['result'][x].DESCRIPCION;
    producto.precio = json['result'][x].PRECIO;

    this.lista_productos.push(producto);
    }
  }

  navegarNuevoProducto(){
    this.router.navigate(['crear-producto'], { replaceUrl: true });
  }
}