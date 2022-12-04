import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthentificationService } from "../services/auth.service";
import { filter, map, take } from 'rxjs/operators';
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user: string;

  constructor(private authService: AuthentificationService, private router: Router, private alertController: AlertController) { }

  canActivate(): Observable<boolean> {

    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/login/login');
          this.presentAlert();
          return false;
        }
      })
    );
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Access not possible!',
      message: 'Log in first to gain access.',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
        },
        {
          text: 'do not login',
          role: 'cancel',
          handler: () => {
            window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
          },
        }
      ],
    });
    await alert.present();
  }
}
