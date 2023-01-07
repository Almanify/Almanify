import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {AuthenticationService} from '../services/auth.service';
import {filter, map, take} from 'rxjs/operators';
import {AlertController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user: string;

  constructor(private authService: AuthenticationService,
              private navController: NavController,
              private alertController: AlertController,
              private route: ActivatedRoute) {
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter((v) => v !== null),
      take(1),
      map((v) => {
        if (v) {
          return true;
        } else {
          this.navController.navigateRoot('/login/login');
          return false;
        }
      })
    );
  }

  async _presentAlert() {
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
