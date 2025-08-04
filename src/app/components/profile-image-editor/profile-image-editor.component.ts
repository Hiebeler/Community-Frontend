import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
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
    private userService: UserService,
    private toastr: ToastrService
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

  async saveImage() {
    const url = this.domSanitizer.sanitize(
      SecurityContext.URL,
      this.croppedImage
    );
    if (!url) {
      this.toastr.error('Fehler beim Verarbeiten des Bildes.');
      return;
    }

    try {
      const blob = await fetch(url).then((res) => res.blob());

      const croppedImg = new File([blob], 'avatar.png', {
        type: blob.type,
        lastModified: Date.now(),
      });

      this.subscriptions.push(
        this.apiService.uploadImage(croppedImg).subscribe((res) => {
          if (res.success) {
            this.userService.fetchUserFromApi();
            this.parentCloseEditor();
            this.toastr.success('Avatar geändert');
          } else {
            this.toastr.error('Ein Fehler ist aufgetreten');
          }
        })
      );
    } catch (error) {
      this.toastr.error('Bild konnte nicht verarbeitet werden.');
    }
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.domSanitizer.bypassSecurityTrustUrl(
      event.objectUrl
    );
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

  parentCloseEditor() {
    this.closeEditor.emit();
  }
}
