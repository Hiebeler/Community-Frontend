import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, TranslocoModule],
  templateUrl: './footer.html',
})
export class Footer {}
