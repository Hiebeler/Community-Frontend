import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('150ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class PopupComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() hasAbortButton: boolean = true;
  @Input() submitText: string = 'Confirm';
  @Input() isDanger: boolean = false;
  @Output() submit = new EventEmitter<void>();
  @Output() abort = new EventEmitter<void>();
}
