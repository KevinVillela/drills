import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatSelect,
  MatSelectModule,
  MatToolbarModule,
  MatTooltipModule,
  MatListModule,
  MatCheckbox,
  MatCheckboxModule,
  MatDialogModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from 'angularfire2';

import {HomeComponent} from './home.component';
import { CourtModule } from '../court/court.module';
import { FilterModule } from '../../filter/filter.module';
import { PreviewModule } from '../../preview/preview.module';
import { SelectDrillComponent } from './select-drill/select-drill.component';

@NgModule({
  imports : [
    CommonModule,
    AngularFireModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    RouterModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatExpansionModule,
    CourtModule,
    FilterModule,
    PreviewModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  declarations : [ HomeComponent, SelectDrillComponent ],
  exports : [ HomeComponent, SelectDrillComponent ],
  entryComponents: [SelectDrillComponent]
})
export class HomeModule {
}
