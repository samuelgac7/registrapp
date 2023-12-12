import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario_creado: string = '';
  contrasena_creada: string = '';

  mdl_usuario: string = '';
  mdl_contrasena: string = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    let extras = this.router.getCurrentNavigation();

    if (extras?.extras.state) {
      this.usuario_creado = extras?.extras.state['user'];
      this.contrasena_creada = extras?.extras.state['pass'];
    }
  }

  irCrearUsuario() {

    let extras: NavigationExtras = {
      replaceUrl: true
    }

    this.router.navigate(['crear-usuario'], extras);
  }

  ingresar() {
      let extras: NavigationExtras = {
        replaceUrl: true,
        state: {
          user: this.mdl_usuario,
          pass: this.mdl_contrasena
        }
      }

      this.router.navigate(['principal'], extras);
    }

  login() {
    let extras: NavigationExtras = {
      replaceUrl: true,
      state: {
        user: this.mdl_usuario,
        pass: this.mdl_contrasena
      }
    }

    this.db.loginUsuario(this.mdl_usuario, this.mdl_contrasena)
    .then(data => {
    if (data == 1) {
      this.db.almacenarSesion(this.mdl_usuario, this.mdl_contrasena)
      this.router.navigate(['principal'], extras);
    } else {
      console.log('SG: Credenciales inválidas');
    }
    })

  }
  }

