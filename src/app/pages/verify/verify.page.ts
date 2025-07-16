import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  code: string | null = '';
  constructor(private route: ActivatedRoute, private authService: AuthService
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code');
    console.log(this.code);
    this.authService.verify(this.code);
  }

}
