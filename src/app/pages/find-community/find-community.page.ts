import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Community } from 'src/app/models/community';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-find-community',
  templateUrl: './find-community.page.html',
  styleUrls: ['./find-community.page.scss'],
})
export class FindCommunityPage {

  searchForm: FormGroup;

  loading = false;
  didntFoundCommunity = false;

  foundCommunity: Community = null;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl<string | null>('',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]
      )
    });
  }

  get search() {
    return this.searchForm.get('search');
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.loading = true;
      this.didntFoundCommunity = false;
      this.foundCommunity = null;
      this.apiService.getCommunityByCode(this.search.value).subscribe(community => {
        this.loading = false;
        if (community?.id) {
          this.foundCommunity = community;
          console.log(community);
        }
        else {
          this.didntFoundCommunity = true;
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
        this.alertService.showAlert(
          'Fehler',
          res.errors[0]
        );
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
    this.router.navigate(['create-community']);
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }
}
