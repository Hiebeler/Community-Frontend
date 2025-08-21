import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArrowRightIcon, LucideAngularModule } from 'lucide-angular';
import { AuthService } from 'src/app/services/auth.service';
import { Footer } from 'src/app/components/footer/footer';

@Component({
  selector: 'app-landing-layout',
  imports: [RouterModule, LucideAngularModule, Footer],
  templateUrl: './landing-layout.component.html',
})
export class LandingLayoutComponent {
  readonly arrowRightIcon = ArrowRightIcon;

  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.activeUserId() != null);
}
