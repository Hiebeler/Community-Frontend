import {
  provideTransloco,
  TranslocoModule
} from '@jsverse/transloco';
import { NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { environment } from '../environments/environment';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['de', 'en'],
        defaultLang: 'de',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production
      },
      loader: TranslocoHttpLoader
    }),
    provideTranslocoPersistLang({
      storage: {
        useValue: localStorage,
      },
    }),
  ],
})
export class TranslocoRootModule { }
