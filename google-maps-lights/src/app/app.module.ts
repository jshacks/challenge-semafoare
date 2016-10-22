import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
