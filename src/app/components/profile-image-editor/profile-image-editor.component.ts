import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-image-editor',
  templateUrl: './profile-image-editor.component.html',
  styleUrls: ['./profile-image-editor.component.scss'],
})
export class ProfileImageEditorComponent implements OnInit {

  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

  user: User;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  croppedImg: any = '';

  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  saveImage() {
    this.croppedImg = this.dataURLtoFile(this.cropImgPreview, 'hello.png');
    this.apiService.uploadImage(this.croppedImg).subscribe((res: any) => {
      if (res.data.link) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.apiService.updateUser({ profile_image: res.data.link }).subscribe((updateRes) => {
          if (updateRes.status === 'OK') {
            this.user.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.parentCloseEditor();
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

  parentCloseEditor() {
    this.closeEditor.emit();
  }

}
