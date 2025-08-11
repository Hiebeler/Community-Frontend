import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArrowRightIcon, LucideAngularModule } from 'lucide-angular';
import { AuthService } from 'src/app/services/auth.service';
import { Footer } from "src/app/components/footer/footer";

@Component({
  selector: 'app-landing-layout',
  imports: [RouterModule, LucideAngularModule, Footer],
  templateUrl: './landing-layout.component.html',
})
export class LandingLayoutComponent implements OnInit {
readonly arrowRightIcon = ArrowRightIcon;

  isLoggedIn = false;

    constructor(private authService: AuthService) {}

    ngOnInit() {
      this.authService.activeUserId.subscribe((id) => {
        this.isLoggedIn = id != null;
      });
    }
}
