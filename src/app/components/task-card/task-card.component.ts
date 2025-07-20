import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Task } from 'src/app/models/task';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
    imports: [
      CommonModule,
      IonicModule
    ],
    standalone: true
})
export class TaskCardComponent implements OnInit {

  @Input() task: Task;
  @Output() openModal: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  cardClicked() {
    this.openModal.emit();
  }

}
