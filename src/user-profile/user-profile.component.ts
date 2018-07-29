import { Component } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'drills-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {


  constructor(readonly auth: AuthService, dbService: DatabaseService) {
    // dbService.migrate();
  }

}
