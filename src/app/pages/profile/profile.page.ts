import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  async logout() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-two',
      backdropDismiss: false,
      header: 'Are you sure?',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Logout',
        role: 'ok',
        handler: () => {
          this.authService.logout();
        }
      }]
    });
    await alert.present();
  }

}
