import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-image-editor',
  templateUrl: './profile-image-editor.component.html',
  imports: [CommonModule, ImageCropperComponent],
})
export class ProfileImageEditorComponent implements OnInit, OnDestroy {
  @Output() closeEditor: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];

  user: User;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';

  cropImgPreview: any = '';

  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe((user) => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  saveImage() {
    const croppedImg: File = this.dataURLtoFile(this.croppedImage, 'hello.png');
    this.subscriptions.push(
      this.apiService.uploadImage(croppedImg).subscribe((res: any) => {
        if (res.data.link) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          this.subscriptions.push(
            this.userService
              .updateUser({ profile_image: res.data.link })
              .subscribe((wasSuccessful) => {
                if (wasSuccessful) {
                  this.user.profileimage =
                    this.domSanitizer.bypassSecurityTrustResourceUrl(
                      res.data.link
                    );
                  this.parentCloseEditor();
                }
              })
          );
        }
      })
    );
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  dataURLtoFile(dataurl, filename) {
    console.log(dataurl)
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
