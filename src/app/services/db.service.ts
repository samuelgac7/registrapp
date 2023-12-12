import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private sqlite: SQLite) {
    this.crearTablas();
  }

  crearTablas() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('create table if not exists persona (usuario varchar(30), contrasena varchar (30), correo varchar (75), nombre varchar (30), apellido varchar (30))', [])
          .catch(e => console.log('SG: Error al crear tabla persona' + JSON.stringify(e)));
      })
      .catch(e => console.log('SG: Error al crear o abrir DB'));

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('create table if not exists sesion(usuario varchar (30), contrasena varchar (30))', [])
          .catch(e => console.log('SG: Error al crear tabla sesion' + JSON.stringify(e)));
      })
      .catch(e => console.log('SG: Error al crear o abrir DB'));
  }

  almacenarUsuario(usuario: string, contrasena: string, correo: string, nombre: string, apellido: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('insert into persona values(?, ?, ?, ?, ?)', [usuario, contrasena, correo, nombre, apellido])
          .catch(e => console.log('SG: Error al almacenar persona' + JSON.stringify(e)));
      })
      .catch(e => console.log('SG: Error al crear o abrir DB'));
  }

  almacenarSesion(usuario: string, contrasena: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('insert into sesion values(?, ?)', [usuario, contrasena])
          .catch(e => console.log('SG: Error al almacenar sesion' + JSON.stringify(e)));
      })
      .catch(e => console.log('SG: Error al crear o abrir DB'));
  }

  eliminarSesion() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('delete from sesion', [])
          .catch(e => console.log('SG: Error al cerrar sesion' + JSON.stringify(e)));
      })
      .catch(e => console.log('SG: Error al crear o abrir DB'));
  }

  async loginUsuario(usuario: string, contrasena: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const data = await db.executeSql('select count(usuario) as cantidad from persona where usuario = ? and contrasena = ?', [usuario, contrasena]);
      return data.rows.item(0).cantidad;
    } catch (e) {
      return console.log('SG: Error al realizar login' + JSON.stringify(e));
    }
  }

  async validarSesion() {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const data = await db.executeSql('select count(usuario) as cantidad from sesion', []);
      return data.rows.item(0).cantidad;
    } catch (e) {
      return console.log('SG: Error al realizar sesion' + JSON.stringify(e));
    }
  }

  async infoUsuario(usuario: string, contrasena: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const data = await db.executeSql('select correo, nombre, apellido, contrasena from persona where usuario = ? and contrasena = ?', [usuario, contrasena]);
      let objeto: any = {};
      objeto.nombre = data.rows.item(0).nombre;
      objeto.correo = data.rows.item(0).correo;
      objeto.apellido = data.rows.item(0).apellido;
      objeto.contrasena = data.rows.item(0).contrasena;
      return objeto;
    } catch (e) {
      return console.log('SG: Error al obtener info de persona' + JSON.stringify(e));
    }
  }

  cambiarContrasena(usuario: string, contrasenaActual: string, contrasenaNueva: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('update persona set contrasena = ? where usuario = ? and contrasena = ?', [contrasenaNueva, usuario, contrasenaActual])
          .catch(e => console.log('SG: Error al modificar persona' + JSON.stringify(e)));
      })
      .catch(e => console.log('SG: Error al crear o abrir DB'));
  }

  async obtenerSesion(): Promise<{ usuario: string, contrasena: string }> {
    try {
      const db = await this.sqlite.create({ name: 'data.db', location: 'default' });
      const res = await db.executeSql('select usuario, contrasena from sesion limit 1', []);
      if (res.rows.length > 0) {
        return { usuario: res.rows.item(0).usuario, contrasena: res.rows.item(0).contrasena };
      } else {
        throw new Error('No session found');
      }
    } catch (error) {
      console.error('SG: Error al obtener la sesión', error);
      throw error;
    }
  }
}