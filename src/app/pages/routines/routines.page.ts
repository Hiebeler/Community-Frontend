import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule, PlusIcon } from 'lucide-angular';
import { Navbar } from 'src/app/components/navbar/navbar';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { RoutineCardComponent } from 'src/app/components/routine-card/routine-card.component';
import { RoutineEditorComponent } from 'src/app/components/routine-editor/routine-editor.component';
import { Routine } from 'src/app/models/routine.model';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.page.html',
  imports: [
    CommonModule,
    RouterModule,
    RoutineEditorComponent,
    RoutineCardComponent,
    LucideAngularModule,
    PopupComponent,
    Navbar,
  ],
})
export class RoutinesPage implements OnInit {
  readonly plusIcon = PlusIcon;
  readonly backIcon = ArrowLeftIcon;

  completedFirstLoad = false;

  newRoutineEditorIsOpen = false;

  openRoutineEditor: Routine = null;

  activeRoutines = this.calendarService.activeRoutines;
  inactiveRoutines = this.calendarService.inactiveRoutines;

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.fetchRoutinesFromApi();
  }

  getRoutines() {
    this.calendarService.fetchRoutinesFromApi();
  }

  openNewRoutineEditor(state: boolean) {
    this.newRoutineEditorIsOpen = state;
  }

  openUpdateEditor(routine: Routine) {
    this.openRoutineEditor = routine;
  }
}
