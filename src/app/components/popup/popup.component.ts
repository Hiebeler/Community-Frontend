import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  imports: [
    CommonModule
  ]
})
export class PopupComponent {

  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }
}
