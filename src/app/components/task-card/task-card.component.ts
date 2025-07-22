import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/task';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    imports: [
      CommonModule,
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
