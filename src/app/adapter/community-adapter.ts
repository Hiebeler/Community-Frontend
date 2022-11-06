import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Community } from '../models/community';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class CommunityAdapter implements Adapter<Community> {
  adapt(item: any): Community {
    return new Community(item);
  }
}
