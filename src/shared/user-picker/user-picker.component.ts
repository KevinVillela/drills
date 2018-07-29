import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatInput} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {map, startWith, take, withLatestFrom} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

import {DatabaseService, User, UserPlan} from '../../database.service';

@Component({
  selector : 'drills-user-picker',
  templateUrl : './user-picker.component.html',
  styleUrls : [ './user-picker.component.scss' ],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class UserPickerComponent implements OnInit {

  readonly inputSubject = new Subject<string>();

  users: Observable<User[]>;
  filteredUsers: Observable<User[]>;
  @Input() selectedUsers: { [userPlanId: string]: UserPlan} = {};
  @ViewChild('input') input: ElementRef;

  constructor(private readonly dbService: DatabaseService) {
    this.users = this.dbService.users;
    this.filteredUsers = this.inputSubject.pipe(
        startWith(''), withLatestFrom(this.users), map(([ value, users ]) => {
          const filtered = users.filter(
              (user) =>
                  (user.displayName || user.email).toLowerCase().includes(value.toLowerCase()));
                  filtered.push({
                    uid: '',
                    email: '',
                    displayName: value,
                  });
                  return filtered;
        }));
  }

  getSelectedUsers(): UserPlan[] {
    return Object.values(this.selectedUsers);
  }

  add(event: MatAutocompleteSelectedEvent): void {
    const user: UserPlan = event.option.value;
    this.selectedUsers[`${user.uid}_${user.displayName}`] = user;
    this.input.nativeElement.value = '';
  }

  remove(user: UserPlan): void {
    delete this.selectedUsers[`${user.uid}_${user.displayName}`];
  }

  ngOnInit() { }
}
