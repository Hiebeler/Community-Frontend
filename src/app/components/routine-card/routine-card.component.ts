import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Routine } from 'src/app/models/routine';

@Component({
    selector: 'app-routine-card',
    templateUrl: './routine-card.component.html',
    styleUrls: ['./routine-card.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      IonicModule
    ]
})
export class RoutineCardComponent implements OnInit {

  @Input() routine: Routine;

  constructor() { }

  ngOnInit() {}

}
