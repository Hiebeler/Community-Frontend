import { SafeResourceUrl } from '@angular/platform-browser';
import { ApiCommunity, Community } from './community.model';

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  profile_image?: string;
  creationdate: string;
  isAdmin?: boolean;
  fk_community_id: number;
  communities: ApiCommunity[];
}

export class User {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly avatar: SafeResourceUrl;
  readonly creationDate: Date;
  readonly isAdmin: boolean;
  readonly communityId: number;
  readonly communities: Community[];

  constructor(params: {
    id: number;
    email: string;
    name: string;
    profileImage: SafeResourceUrl;
    creationDate: Date;
    isAdmin?: boolean;
    communityId: number;
    communities?: Community[];
  }) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.avatar = params.profileImage;
    this.creationDate = params.creationDate;
    this.isAdmin = params.isAdmin ?? false;
    this.communityId = params.communityId;
    this.communities = params.communities ?? [];
  }
}
