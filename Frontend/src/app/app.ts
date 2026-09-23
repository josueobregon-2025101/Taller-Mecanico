import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  esRutaAutenticacion = false;

  constructor(
    private router: Router
  ) {

    this.actualizarTipoRuta(
      this.router.url
    );

    this.router.events
      .pipe(
        filter(
          (evento) =>
            evento instanceof NavigationEnd
        )
      )
      .subscribe((evento) => {

        const navegacion =
          evento as NavigationEnd;

        this.actualizarTipoRuta(
          navegacion.urlAfterRedirects
        );
      });
  }

  private actualizarTipoRuta(
    url: string
  ): void {

    this.esRutaAutenticacion =
      url.startsWith('/login') ||
      url.startsWith('/register');
  }

}