import { Component } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  activeLang: string;

  constructor(private translocoService: TranslocoService) {
    this.activeLang = translocoService.getActiveLang();
  }

  toggleLang() {
    if (this.activeLang == "en") {
      this.translocoService.setActiveLang("de");
      this.activeLang = "de";
    } else {
      this.translocoService.setActiveLang("en");
      this.activeLang = "en";
    }
  }
}
