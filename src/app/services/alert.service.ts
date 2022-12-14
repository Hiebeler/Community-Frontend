import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  showAlert(
    header: string,
    message: string,
    submitButtonText: string = 'Okay',
    submitButtonCallback: () => void = Function,
    cancleButtonText?: string
  ) {
    let cssClass = 'custom-alert-ok';
    if (cancleButtonText) {
        cssClass = 'custom-alert-two';
    }

    const alert = this.alertController.create({
      cssClass,
      backdropDismiss: false,
      message,
      header,
      buttons: [{
        text: submitButtonText,
        handler: () => submitButtonCallback()
      }],
    });
    alert.then(createdAlert => createdAlert.present());
  }
}
