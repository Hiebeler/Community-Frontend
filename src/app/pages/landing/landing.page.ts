import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  gotoRegister() {
    this.router.navigate(['/register']);
  }

  gotoApp() {
    this.router.navigate(['/tabs/tasks']);
  }

}
