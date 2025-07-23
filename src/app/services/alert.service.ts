import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface AlertOptions {
  header: string;
  message: string;
  submitButtonText?: string;
  submitButtonCallback?: () => void;
  cancelButtonText?: string;
  cancelButtonCallback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
private alertSubject = new BehaviorSubject<AlertOptions | null>(null);
  alert: Observable<AlertOptions | null> = this.alertSubject.asObservable();
  constructor() { }

  showAlert(
    header: string,
    message: string,
    submitButtonText = 'Okay',
    submitButtonCallback: () => void = () => {},
    cancelButtonText?: string,
    cancelButtonCallback: () => void = () => {}
  ) {
    console.log("show alert");
    this.alertSubject.next({
      header,
      message,
      submitButtonText,
      submitButtonCallback,
      cancelButtonText,
      cancelButtonCallback,
    });
  }
   
  closeAlert() {
    this.alertSubject.next(null);
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
