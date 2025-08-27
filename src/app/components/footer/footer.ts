import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSwitcher } from "../language-switcher/language-switcher";

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, TranslocoModule, LanguageSwitcher],
  templateUrl: './footer.html',
})
export class Footer {}
