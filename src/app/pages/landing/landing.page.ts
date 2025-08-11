import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  CircleCheckBigIcon,
  HeartIcon,
  LucideAngularModule,
  ShieldIcon,
  ShoppingCartIcon,
  SparklesIcon,
} from 'lucide-angular';
import { FeatureCard } from 'src/app/components/feature-card/feature-card';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  imports: [CommonModule, RouterModule, LucideAngularModule, FeatureCard],
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

  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.activeUserId.subscribe((id) => {
      this.isLoggedIn = id != null;
    });
  }
}
