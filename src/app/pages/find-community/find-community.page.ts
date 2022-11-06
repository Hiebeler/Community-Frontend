import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Community } from 'src/app/models/community';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-find-community',
  templateUrl: './find-community.page.html',
  styleUrls: ['./find-community.page.scss'],
})
export class FindCommunityPage {

  searchForm: FormGroup;

  foundCommunity: Community = null;

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl<string | null>('', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$')])
    });
  }

  get search() {
    return this.searchForm.get('search');
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.apiService.getCommunityByCode(this.search.value).subscribe((community) => {
        if (community.id) {
          this.foundCommunity = community;
        }
        else {
          this.foundCommunity = null;
        }
      });
    }
  }

  join() {
    const data = {
      code: this.foundCommunity.code
    };
    this.apiService.joinCommunity(data).subscribe(async (res) => {
      if (res.status === 'Error') {
        const alert = await this.alertController.create({
          cssClass: 'custom-alert-two',
          backdropDismiss: false,
          header: 'Fehler',
          message: res.errors[0],
          buttons: [{
            text: 'Ok'
          }]
        });
        await alert.present();
      }
      else {
        const toast = await this.toastController.create({
          message: 'Anfrage gesendet',
          duration: 1500,
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  gotoCreateCommunity() {
    this.router.navigate(['/tabs/create-community']);
  }
}
