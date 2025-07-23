import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {
  alert = null;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alert.subscribe((alert) => {
      this.alert = alert;
    });
  }

  onSubmit() {
    if (this.alert?.submitButtonCallback) {
      this.alert.submitButtonCallback();
    }
    this.alertService.closeAlert();
  }

  onCancel() {
    if (this.alert?.cancelButtonCallback) {
      this.alert.cancelButtonCallback();
    }
    this.alertService.closeAlert();
  }

}
