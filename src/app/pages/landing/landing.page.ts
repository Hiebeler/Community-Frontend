import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  CircleCheckBigIcon,
  GiftIcon,
  GlobeIcon,
  HeartIcon,
  LucideAngularModule,
  PiggyBankIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SparklesIcon,
  SquareStackIcon,
  ZapIcon,
} from 'lucide-angular';
import { FeatureCard } from 'src/app/components/feature-card/feature-card';
import { WhyCard } from 'src/app/components/why-card/why-card';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  imports: [CommonModule, RouterModule, LucideAngularModule, FeatureCard, WhyCard, TranslocoModule],
})
export class LandingPage {
  readonly switchIcon = ArrowLeftRightIcon;
  readonly checkIcon = CircleCheckBigIcon;
  readonly shoppingCartIcon = ShoppingCartIcon;
  readonly calendarIcon = CalendarIcon;
  readonly sparklesIcon = SparklesIcon;
  readonly arrowRightIcon = ArrowRightIcon;
  readonly heartIcon = HeartIcon;
  readonly shieldIcon = ShieldIcon;
  readonly globeIcon = GlobeIcon;
  readonly giftIcon = GiftIcon;
  readonly zapIcon = ZapIcon;
  readonly debtIcon = PiggyBankIcon;
  readonly multipleCommunitiesIcon = SquareStackIcon;

  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.activeUserId() != null);
}
