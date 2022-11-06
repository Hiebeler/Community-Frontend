import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.page.html',
  styleUrls: ['./create-community.page.scss'],
})
export class CreateCommunityPage {

  communityForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.communityForm = new FormGroup({
      name: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)])
    });
   }

   get name() {
    return this.communityForm.get('name');
  }

  createCommunity() {
    if (this.communityForm.valid) {
      this.apiService.createCommunity({ name: this.name.value }).subscribe(async (res) => {
        if (res.status === 'Error') {
          this.alertService.showOkayAlertWithoutAction('Error', res.errors[0]);
        } else {
          this.alertService.showOkayAlertWithoutAction('Community erstellt', 'Code: ' + res.data.code);
        }
      });
    }
  }

}
