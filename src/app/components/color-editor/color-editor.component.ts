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

  colors: any =
    [
      {
        color: '#54B435',
        username: ''
      },
      {
        color: '#FD841F',
        username: ''
      },
      {
        color: '#5837D0',
        username: ''
      },
      {
        color: '#0D4C92',
        username: ''
      },
      {
        color: '#CC3636',
        username: ''
      },
      {
        color: '#3D8361',
        username: ''
      },
      {
        color: '#FFC23C',
        username: ''
      }
    ];

  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) { }

  ngOnInit() {

    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
      console.log(this.usersInCommunity);
      this.fillColorArray();
    });
  }

  parentCloseEditor() {
    this.closeEditor.emit();
  }

  fillColorArray() {
    this.colors.forEach(colorElement => {
      colorElement.username = '';
    });


    this.usersInCommunity.forEach(user => {
      this.colors.forEach(colorElement => {
        if (colorElement.color === user.color) {
          colorElement.username = user.firstname;
        }
      });
    });
  }

  changeColor(color: string) {
    let canChooseColor = true;
    this.colors.forEach(colorElement => {
      if (colorElement.color === color && colorElement.username !== '') {
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
