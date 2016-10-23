import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import {
  SemafoareService,
  GoogleMapsComponent,
  AppComponent
} from './index';

@NgModule({
  declarations: [
    GoogleMapsComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
  ],
  providers: [SemafoareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
