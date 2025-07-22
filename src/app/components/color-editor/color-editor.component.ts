import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-color-editor',
    templateUrl: './color-editor.component.html',
    standalone: true,
    imports: [
      CommonModule,
      IonicModule
    ]
})
export class ColorEditorComponent implements OnInit, OnDestroy {

  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];

  user: User;
  usersInCommunity: User[];

  colors: string[] = [
    '#54B435',
    '#FD841F',
    '#5837D0',
    '#0D4C92',
    '#CC3636',
    '#3D8361',
    '#FFC23C',
    '#7358ff',
    '#e8115b',
    '#0d73ec',
    '#1e3264',
    '#f59b23',
    '#8c1932',
    '#ff4632'
  ];

  colorUsernames: string[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {

    this.colorUsernames = Array(this.colors.length).fill('');

    this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    }));

    this.subscriptions.push(this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
      this.fillColorArray();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  parentCloseEditor() {
    this.closeEditor.emit();
  }

  fillColorArray() {
    this.colorUsernames = Array(this.colors.length).fill('');
    this.usersInCommunity.forEach(user => {
      this.colors.forEach((colorElement, index) => {
        if (colorElement === user.color) {
          this.colorUsernames[index] = user.firstname;
        }
      });
    });
  }

  changeColor(color: string) {
    let canChooseColor = true;
    this.colors.forEach((colorElement, index) => {
      if (colorElement === color && this.colorUsernames[index] !== '') {
        canChooseColor = false;
      }
    });

    if (canChooseColor) {
      this.updateUser({ color });
    }
  }

  updateUser(data: any) {
    this.subscriptions.push(this.userService.updateUser(data).subscribe(wasSuccessful => {
      if (wasSuccessful) {
        this.userService.fetchUserFromApi();
      }
    }));
  }
}
