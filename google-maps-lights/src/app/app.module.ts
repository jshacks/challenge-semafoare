import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {SemafoareService} from './shared/semafoare/semafoare.service';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { GoogleMapsComponent } from './google-maps/google-maps.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
  ],
  providers: [SemafoareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
