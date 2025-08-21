import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Community } from 'src/app/models/community.model';
import { AlertService } from 'src/app/services/alert.service';
import { CommunityService } from 'src/app/services/community.service';
import { PrimaryButton } from '../primary-button/primary-button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-join-community',
  templateUrl: './join-community.component.html',
  imports: [ReactiveFormsModule, PrimaryButton],
})
export class JoinCommunityComponent implements OnInit {
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  subscriptions: Subscription[] = [];

  searchForm: FormGroup;
  loading = false;
  didntFoundCommunity = false;
  isLoadingRequest = false;

  foundCommunity: Community = null;
  constructor(
    private communityService: CommunityService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  ngOnInit() {}

  get search() {
    return this.searchForm.get('search');
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.loading = true;
      this.didntFoundCommunity = false;
      this.foundCommunity = null;
      this.subscriptions.push(
        this.communityService
          .getCommunity(this.search.value)
          .subscribe((community) => {
            this.loading = false;
            if (community?.id) {
              this.foundCommunity = community;
            } else {
              this.didntFoundCommunity = true;
              this.foundCommunity = null;
            }
          })
      );
    }
  }

  join() {
    this.isLoadingRequest = true;
    this.subscriptions.push(
      this.communityService
        .joinCommunity(this.foundCommunity.code)
        .subscribe((res) => {
          this.isLoadingRequest = false;
          if (res.success) {
            this.toastr.success('Beitrittsanfrage gesendet');
            this.closePopup.emit();
          } else {
            this.toastr.error(res.error);
          }
        })
    );
  }
}
