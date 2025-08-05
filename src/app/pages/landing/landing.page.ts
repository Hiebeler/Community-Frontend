import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArrowLeftRightIcon, ArrowRightIcon, CalendarIcon, CheckIcon, CircleCheckBigIcon, HeartIcon, LucideAngularModule, ShieldIcon, ShoppingCartIcon, SparklesIcon } from 'lucide-angular';
import { FeatureCard } from 'src/app/components/feature-card/feature-card';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    imports: [
      CommonModule,
      RouterModule,
      LucideAngularModule,
      FeatureCard
    ]
})
export class LandingPage implements OnInit {
  readonly switchIcon = ArrowLeftRightIcon;
  readonly checkIcon = CircleCheckBigIcon;
  readonly shoppingCartIcon = ShoppingCartIcon;
  readonly calendarIcon = CalendarIcon;
  readonly sparklesIcon = SparklesIcon;
  readonly arrowRightIcon = ArrowRightIcon;
  readonly heartIcon = HeartIcon;
  readonly shieldIcon = ShieldIcon;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }
}
