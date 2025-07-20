import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, { EffectCards } from 'swiper';

SwiperCore.use([EffectCards]);

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
    standalone: false
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
    this.router.navigate(['tabs/tasks']);
  }

}
