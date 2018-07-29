import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatAutocompleteModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';

import {UserPickerComponent} from './user-picker.component';

@NgModule({
  imports : [
    CommonModule, MatAutocompleteModule, MatFormFieldModule, FormsModule, MatInputModule,
    ReactiveFormsModule, MatChipsModule, MatIconModule
  ],
  declarations : [ UserPickerComponent ],
  exports : [ UserPickerComponent ],
  providers :
      [ {provide : MAT_CHIPS_DEFAULT_OPTIONS, useValue : {separatorKeyCodes : [ ENTER, COMMA ]}} ]
})
export class UserPickerModule {
}
