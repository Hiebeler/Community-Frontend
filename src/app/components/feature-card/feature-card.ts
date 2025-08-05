import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-feature-card',
  imports: [LucideAngularModule],
  templateUrl: './feature-card.html',
})
export class FeatureCard {
  @Input() title: string;
  @Input() description: string;
  @Input() borderColor: string;
  @Input() backgroundColor: string;
  @Input() icon: LucideIconData
}
