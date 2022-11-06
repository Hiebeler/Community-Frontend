import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Community } from 'src/app/models/community';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-find-community',
  templateUrl: './find-community.page.html',
  styleUrls: ['./find-community.page.scss'],
})
export class FindCommunityPage {

  searchForm: FormGroup;

  foundCommunity: Community = null;

  constructor(
    private apiService: ApiService
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl<string | null>('', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$')])
    });
  }

  get search() {
    return this.searchForm.get('search');
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.apiService.getCommunityByCode(this.search.value).subscribe((community) => {
        this.foundCommunity = community;
      });
    }
  }
}
