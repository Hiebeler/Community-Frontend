import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Loader2Icon, LucideAngularModule } from 'lucide-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  imports: [CommonModule, RouterModule, LucideAngularModule, TranslocoModule],
})
export class VerifyPage implements OnInit {
  readonly loaderIcon = Loader2Icon;

  code: string | null = '';

  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code');

    this.isLoading = true;
    this.authService.verify(this.code).subscribe((res) => {
      this.isLoading = false;
      this.error = res.success ? '' : res.error;
    });
  }
}
