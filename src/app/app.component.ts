import {Component, HostListener, ViewChild} from '@angular/core';
import { AuthService } from '../core/auth/auth.service';



@Component({
  selector: 'drills-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(readonly authService: AuthService) {}

}
