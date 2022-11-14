import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  showOkayAlertWithoutAction(header: string, message: string) {
    const alert = this.alertController.create({
      cssClass: 'custom-alert-ok',
      backdropDismiss: false,
      message,
      header,
      buttons: ['Okay']
    });
    alert.then(createdAlert => createdAlert.present());
  }

  showTwoButtonAlert(
    header: string,
    message: string,
    action: () => any,
    abortButtonText: string = 'Abbrechen',
    okayButtonText: string = 'Okay') {
    const alert = this.alertController.create({
      cssClass: 'custom-alert-two',
      backdropDismiss: false,
      message,
      header,
      buttons: [{
        text: abortButtonText
      },
      {
        text: okayButtonText,
        handler: () => action()
      }]
    });
    alert.then(createdAlert => createdAlert.present());
  }
}
