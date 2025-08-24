import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Routine } from 'src/app/models/routine.model';

@Component({
    selector: 'app-routine-card',
    templateUrl: './routine-card.component.html',
    imports: [
      CommonModule, TranslocoModule
    ]
})
export class RoutineCardComponent implements OnInit {

  @Input() routine: Routine;

  constructor() { }

  ngOnInit() {}

}
