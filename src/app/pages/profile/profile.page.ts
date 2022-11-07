import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private userService: UserService,
    private apiService: ApiService
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
      console.log(requests);
      this.requests = requests;
    });
  }

  async accept(id: number) {
    console.log(id);
    await this.apiService.acceptRequest({id}).subscribe((res) => {
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

}
