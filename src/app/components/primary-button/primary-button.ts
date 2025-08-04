import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Loader2Icon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-primary-button',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './primary-button.html',
})
export class PrimaryButton {
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() label!: string;
  @Input() customClasses = 'btn-primary w-full';
  @Output() clicked = new EventEmitter<void>();

  readonly loaderIcon = Loader2Icon;

  onClick() {
    if (!this.disabled && !this.isLoading) {
      this.clicked.emit();
    }
  }
}
