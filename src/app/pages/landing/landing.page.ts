import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule
    ]
})
export class LandingPage implements OnInit {

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
