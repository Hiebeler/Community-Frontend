import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import SwiperCore, { EffectCards } from 'swiper';

SwiperCore.use([EffectCards]);

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    standalone: true,
    imports: [
      CommonModule,
      IonicModule
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

  gotoApp() {
    this.router.navigate(['tasks']);
  }

}
