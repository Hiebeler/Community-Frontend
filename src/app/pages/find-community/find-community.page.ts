import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Community } from 'src/app/models/community';
import { AlertService } from 'src/app/services/alert.service';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-find-community',
  templateUrl: './find-community.page.html',
  styleUrls: ['./find-community.page.scss'],
})
export class FindCommunityPage implements OnDestroy {

  subscriptions: Subscription[] = [];

  searchForm: FormGroup;

  loading = false;
  didntFoundCommunity = false;

  foundCommunity: Community = null;

  constructor(
    private communityService: CommunityService,
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.loading = true;
      this.didntFoundCommunity = false;
      this.foundCommunity = null;
      this.subscriptions.push(this.communityService.getCommunity(this.search.value).subscribe(community => {
        this.loading = false;
        if (community?.id) {
          this.foundCommunity = community;
          console.log(community);
        }
        else {
          this.didntFoundCommunity = true;
          this.foundCommunity = null;
        }
      }));
    }
  }

  join() {
    this.subscriptions.push(this.communityService.joinCommunity(this.foundCommunity.code).subscribe(async wasSuccessful => {
      if (wasSuccessful) {
        const toast = await this.toastController.create({
          message: 'Anfrage gesendet',
          duration: 1500,
          position: 'bottom'
        });
        await toast.present();
      }
      else {
        this.alertService.showAlert(
          'Fehler',
          'Beim Beitreten der Community ist ein Fehler aufgetreten.'
        );
      }
    }));
  }

  gotoCreateCommunity() {
    this.router.navigate(['create-community']);
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }
}
