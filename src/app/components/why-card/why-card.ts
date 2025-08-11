import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-why-card',
  imports: [LucideAngularModule],
  templateUrl: './why-card.html',
})
export class WhyCard {
  @Input() title: string;
  @Input() description: string;
  @Input() borderColor: string;
  @Input() backgroundColor: string;
  @Input() icon: LucideIconData
}
