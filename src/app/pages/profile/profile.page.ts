import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { RequestAdapter } from 'src/app/adapter/request-adapter';
import { Community } from 'src/app/models/community';
import { User } from 'src/app/models/user';
import { Request } from 'src/app/models/request';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;
  community: Community;
  usersInCommunity: User[];
  requests: Request[] = [];

  editingImage = false;
  editingColor = false;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  croppedImg: any = '';

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
      }

    ];



  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private userService: UserService,
    private apiService: ApiService,
    private requestAdapter: RequestAdapter
  ) { }

  ngOnInit() {
    this.userService.getLatestUser().subscribe((user) => {
      this.user = user;
      if (user) {
        if (user.communityId) {
          this.apiService.getCommunityById(user.communityId).subscribe((community) => {
            this.community = community;
            this.apiService.getUsersOfCommunity(community.id).subscribe((communityMembers) => {
              this.usersInCommunity = communityMembers;
              this.fillColorArray();
            });
          });
        }
      }
    });
    this.apiService.getRequests().subscribe((requests) => {
      if (requests.status === 'OK') {
        requests = requests.data.map((data: any) => this.requestAdapter.adapt(data));
        this.requests = requests;
      }
    });
  }

  async accept(id: number) {
    await this.apiService.acceptRequest({ id }).subscribe((res) => {

    });
  }

  async logout() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-two',
      backdropDismiss: false,
      header: 'Bist du dir sicher?',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Logout',
        role: 'ok',
        handler: () => {
          this.authService.logout();
        }
      }]
    });
    await alert.present();
  }

  fillColorArray() {
    this.colors.forEach(colorElement => {
      this.usersInCommunity.forEach(user => {
        if (colorElement.color === user.color) {
          colorElement.username = user.firstname;
        } else {
          colorElement.username = '';
        }
      });
    });
  }

  changeColor(color: string) {
    this.apiService.updateUser({color}).subscribe((res) => {
      if (res.status === 'OK') {
        this.user.color = color;
        this.apiService.getUsersOfCommunity(this.community.id).subscribe((communityMembers) => {
          this.usersInCommunity = communityMembers;
          this.fillColorArray();
        });
      }
    });
  }

  editImage(state: boolean) {
    this.editingImage = state;
  }

  editColor(state: boolean) {
    this.editingColor = state;
  }

  saveImage() {
    this.croppedImg = this.cropImgPreview;

    this.apiService.uploadImage(this.croppedImg).subscribe((res: any) => {
      if (res.data.link) {
        // this.user.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
      }
    });
  }


  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

}
