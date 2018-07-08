import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatIconRegistry,
  MatMenuModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {BrowserModule} from '@angular/platform-browser';
import {DomSanitizer} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StarRatingModule} from 'angular-star-rating';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';

import {CadetComponent} from '../cadet/cadet.component';
import {CadetModule} from '../cadet/cadet.module';
import {AuthGuard} from '../core/auth/auth.guard';
import {environment} from '../environments/environment.prod';
import {PlanComponent} from '../plans/plan/plan.component';
import {ViewPlanComponent} from '../plans/plan/view-plan.component';
import {PlansComponent} from '../plans/plans.component';
import {PlansModule} from '../plans/plans.module';
import {PreviewComponent} from '../preview/preview.component';
import {ViewDrillComponent} from '../preview/view.component';
import {UserProfileComponent} from '../user-profile/user-profile.component';
import {UserProfileModule} from '../user-profile/user-profile.module';

import {AboutComponent} from './about/about.component';
import {AboutModule} from './about/about.module';
import {AppComponent} from './app.component';
import {EditDrillComponent} from './edit/edit.component';
import {EditModule} from './edit/edit.module';
import {HomeComponent} from './home/home.component';
import {HomeModule} from './home/home.module';
import {drillsReducer} from './model/model';
import {ModelModule} from './model/model.module';
import {ENTITY_TYPES} from './model/types';

const ROUTES: Routes = [
  {path : '', component : HomeComponent, pathMatch : 'full'},
  {path : 'edit', component : EditDrillComponent, pathMatch : 'full'},
  {
    path : 'edit/:id',
    component : EditDrillComponent,
    pathMatch : 'full',
  },
  {path : 'cadet', component : CadetComponent, pathMatch : 'full'},
  {path : 'cadet/:id', component : CadetComponent, pathMatch : 'full'},
  {path : 'about', component : AboutComponent, pathMatch : 'full'},
  {path : 'profile', component : UserProfileComponent, pathMatch : 'full'},
  {path : 'drills/:id', component : ViewDrillComponent, pathMatch : 'full'},
  {path : 'plans', component : PlansComponent, pathMatch : 'full'},
  {
    path : 'plans/:id',
    component : ViewPlanComponent,
    pathMatch : 'full',
    data : {startExpanded : true}
  },
];

@NgModule({
  declarations : [
    AppComponent,
  ],
  imports : [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ModelModule,
    StoreModule.forRoot({drillsState : drillsReducer}),
    StoreDevtoolsModule.instrument({
      maxAge : 100, // Retains last 100 states
    }),
    RouterModule.forRoot(ROUTES),
    EditModule,
    HomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AboutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CadetModule,
    UserProfileModule,
    StarRatingModule.forRoot(),
    PlansModule,
    MatMenuModule
  ],
  providers : [],
  bootstrap : [ AppComponent ]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    for (const entityType of ENTITY_TYPES) {
      iconRegistry.addSvgIcon(entityType.icon, sanitizer.bypassSecurityTrustResourceUrl(
                                                   `assets/${entityType.icon}.svg`));
    }
    iconRegistry.addSvgIcon('turtle',
                            sanitizer.bypassSecurityTrustResourceUrl(`assets/turtle.svg`));

    iconRegistry.addSvgIcon('cheetah',
                            sanitizer.bypassSecurityTrustResourceUrl(`assets/cheetah.svg`));
    iconRegistry.addSvgIcon('drill',
                            sanitizer.bypassSecurityTrustResourceUrl(`assets/whistle.svg`));
  }
}
