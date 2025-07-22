import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showAlert(
    header: string,
    message: string,
    submitButtonText: string = 'Okay',
    submitButtonCallback: () => void = Function,
    cancleButtonText?: string
  ) {
    let cssClass = 'custom-alert-ok';
    let buttons;
    if (cancleButtonText) {
      cssClass = 'custom-alert-two';
      buttons = [
        {
          text: cancleButtonText
        },
        {
          text: submitButtonText,
          handler: () => submitButtonCallback()
        }
      ];
    } else {
      buttons = [{
        text: submitButtonText,
        handler: () => submitButtonCallback()
      }];
    }

    /* const alert = this.alertController.create({
      cssClass,
      backdropDismiss: false,
      message,
      header,
      buttons,
    });
    alert.then(createdAlert => createdAlert.present()); */
  }
}
