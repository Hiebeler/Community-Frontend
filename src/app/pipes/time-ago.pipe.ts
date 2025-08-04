import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      const temp = new Date(value);
      const seconds = Math.floor((+new Date() - +temp) / 1000);

      if (seconds < 604800) {
        if (seconds < 29) {
          return 'gerade eben';
        }

        const intervals: any = {
          year: 31536000,
          month: 2592000,
          week: 604800,
          day: 86400,
          hour: 3600,
          min: 60,
          sec: 1,
        };

        let counter;
        for (const i in intervals) {
          counter = Math.floor(seconds / intervals[i]);
          if (counter > 0) {
            let unit = '';
            switch (i) {
              case 'year':
                unit = counter === 1 ? 'Jahr' : 'Jahre';
                break;
              case 'month':
                unit = counter === 1 ? 'Monat' : 'Monate';
                break;
              case 'week':
                unit = counter === 1 ? 'Woche' : 'Wochen';
                break;
              case 'day':
                unit = counter === 1 ? 'Tag' : 'Tage';
                break;
              case 'hour':
                unit = counter === 1 ? 'Stunde' : 'Stunden';
                break;
              case 'min':
                unit = counter === 1 ? 'Minute' : 'Minuten';
                break;
              case 'sec':
                unit = counter === 1 ? 'Sekunde' : 'Sekunden';
                break;
            }
            return `vor ${counter} ${unit}`;
          }
        }
      } else {
        const options: any = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return new Date(value).toLocaleDateString('de-AT', options);
      }
    }
    return value;
  }
}
