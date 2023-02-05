import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-color-editor',
  templateUrl: './color-editor.component.html',
  styleUrls: ['./color-editor.component.scss'],
})
export class ColorEditorComponent implements OnInit {

  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

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
    private userService: UserService,
    private apiService: ApiService
  ) { }

  ngOnInit() {

    this.colorUsernames = Array(this.colors.length).fill('');

    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
      this.fillColorArray();
    });
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
    this.apiService.updateUser(data).subscribe((res) => {
      if (res.status === 'OK') {
        this.userService.fetchUserFromApi();
      }
    });
  }
}
