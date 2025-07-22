import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  imports: [
    CommonModule,
    LucideAngularModule
  ]
})
export class PopupComponent {
  readonly closeIcon = XIcon;

  @Input() show = false;
  @Input() title = "";
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }
}
