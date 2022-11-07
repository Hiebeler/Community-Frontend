import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Request } from '../models/request';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class RequestAdapter implements Adapter<Request> {

  constructor(private domSanitizer: DomSanitizer) { }

  adapt(item: any): Request {
    item.date = new Date(item.date);
    return new Request(item);
  }
}
