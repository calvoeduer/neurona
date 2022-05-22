import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NeuronaFormComponent } from './components/neurona-form/neurona-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms'
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    AppComponent,
    NeuronaFormComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatDividerModule,
        MatInputModule,
        ReactiveFormsModule,
        MaterialFileInputModule,
        BrowserAnimationsModule,
        MatSelectModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
