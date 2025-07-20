import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Routine } from 'src/app/models/routine';

@Component({
    selector: 'app-routine-card',
    templateUrl: './routine-card.component.html',
    styleUrls: ['./routine-card.component.scss'],
    standalone: false
})
export class RoutineCardComponent implements OnInit {

  @Input() routine: Routine;

  constructor() { }

  ngOnInit() {}

}
