import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/user';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class UserAdapter implements Adapter<User> {

  constructor(private domSanitizer: DomSanitizer) { }

  adapt(item: any): User {
    item.creationdate = new Date(item.creationdate);
    item.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(item.profileimage);
    return new User(item);
  }
}
