import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { RequestAdapter } from 'src/app/adapter/request-adapter';
import { Community } from 'src/app/models/community';
import { User } from 'src/app/models/user';
import { Request } from 'src/app/models/request';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CommunityService } from 'src/app/services/community.service';
import { Router } from '@angular/router';

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
  editingName = false;

  nameUpdateEditorForm: FormGroup;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  croppedImg: any = '';



  constructor(
    private authService: AuthService,
    private userService: UserService,
    private communityService: CommunityService,
    private apiService: ApiService,
    private requestAdapter: RequestAdapter,
    private alertService: AlertService,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.nameUpdateEditorForm = new FormGroup({
      firstname: new FormControl<string | null>('', [Validators.minLength(1), Validators.required]),
      lastname: new FormControl<string | null>('', [Validators.minLength(1), Validators.required])
    });
  }

  get firstname() {
    return this.nameUpdateEditorForm.get('firstname');
  }

  get lastname() {
    return this.nameUpdateEditorForm.get('lastname');
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    this.communityService.getCurrentCommunity().subscribe(community => {
      this.community = community;
      console.log(this.community);

      if (community) {
        this.apiService.getRequests().subscribe((requests) => {
          if (requests.status === 'OK') {
            requests = requests.data.map((data: any) => this.requestAdapter.adapt(data));
            this.requests = requests;
          }
        });
      }
    });

    this.userService.getUsersInCurrentCommunity().subscribe(users => {
      this.usersInCommunity = users;
    });
  }

  toggleNameEditor() {
    if (!this.editingName) {
      this.nameUpdateEditorForm.controls.firstname.setValue(this.user.firstname);
      this.nameUpdateEditorForm.controls.lastname.setValue(this.user.lastname);
    }
    this.editingName = !this.editingName;
  }

  updateName() {
    this.updateUser({ firstname: this.firstname.value, lastname: this.lastname.value });
  }

  updateUser(data: any) {
    this.apiService.updateUser(data).subscribe((res) => {
      if (res.status === 'OK') {
        this.userService.fetchUserFromApi();
      }
    });
  }

  async accept(id: number) {
    await this.apiService.acceptRequest({ id }).subscribe((res) => {

    });
  }

  async logout() {
    this.alertService.showAlert(
      'Bist du dir sicher?',
      '',
      'Logout',
      this.authService.logout.bind(this.authService),
      'Cancel'
    );
  }



  editImage(state: boolean) {
    this.editingImage = state;
  }

  editColor(state: boolean) {
    this.editingColor = state;
  }

  saveImage() {
    this.croppedImg = this.dataURLtoFile(this.cropImgPreview, 'hello.png');
    this.apiService.uploadImage(this.croppedImg).subscribe((res: any) => {
      if (res.data.link) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.apiService.updateUser({ profile_image: res.data.link }).subscribe((updateRes) => {
          if (updateRes.status === 'OK') {
            this.user.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.editingImage = false;
          }
        });
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


  dataURLtoFile(dataurl, filename) {

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  gotoCreateCommunity() {
    this.router.navigate(['create-community']);
  }

  gotoFindCommunity() {
    this.router.navigate(['find-community']);
  }

}
