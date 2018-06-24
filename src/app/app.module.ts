import {AppComponent} from './app.component';
import {drillsReducer} from './model/model';
import {ModelModule} from './model/model.module'; import { EditDrillComponent } from './edit/edit.component';
import { EditModule } from './edit/edit.module';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment.prod';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AboutComponent } from './about/about.component';
import { AboutModule } from './about/about.module';
import { ENTITY_TYPES } from './model/types';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatIconRegistry, MatToolbarModule, MatTooltipModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {BrowserModule} from '@angular/platform-browser';
import {DomSanitizer} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterModule, Routes} from '@angular/router';
import { CadetComponent } from '../cadet/cadet.component';
import { CadetModule } from '../cadet/cadet.module';

const ROUTES: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'edit', component: EditDrillComponent, pathMatch: 'full'},
  {path: 'edit/:id', component: EditDrillComponent, pathMatch: 'full'},
  {path: 'cadet', component: CadetComponent, pathMatch: 'full'},
  {path: 'about', component: AboutComponent, pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ModelModule,
    StoreModule.forRoot({drillsState: drillsReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 100,  // Retains last 100 states
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
    CadetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    for (const entityType of ENTITY_TYPES) {
    iconRegistry.addSvgIcon(
        entityType.icon, sanitizer.bypassSecurityTrustResourceUrl(`assets/${entityType.icon}.svg`));
    }
}
}

