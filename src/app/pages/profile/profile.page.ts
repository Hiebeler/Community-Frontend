import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { map } from 'rxjs';
import { RequestAdapter } from 'src/app/adapter/request-adapter';
import { Community } from 'src/app/models/community';
import { User } from 'src/app/models/user';
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
  requests: Request[];

  editingImage = false;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  croppedImg: any = '';


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
        console.log(user);
        if (user.communityId) {
          this.apiService.getCommunityById(user.communityId).subscribe((community) => {
            console.log(community);
            this.community = community;
          });
        }
      }
    });
    this.apiService.getRequests().subscribe((requests) => {
      if (requests.status === 'OK') {
        requests = requests.data.map((data: any) => this.requestAdapter.adapt(data));
        console.log(requests);
        this.requests = requests;
      }
    });
  }

  async accept(id: number) {
    console.log(id);
    await this.apiService.acceptRequest({ id }).subscribe((res) => {
      console.log(res);
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

  editImage(state: boolean) {
    this.editingImage = state;
  }

  saveImage() {
    this.croppedImg = this.cropImgPreview;
    console.log(this.croppedImg);

    this.apiService.uploadImage(this.croppedImg).subscribe((res: any) => {
      if (res.data.link) {
        console.log(res.data.link);
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
