import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SigninComponent } from "./signin/signin.component";
import { RegisterComponent } from "./register/register.component";
import { EncrypService } from "./encryp.service";
import { DashboardComponent } from './dashboard/dashboard.component';

let config: any = {
  apiKey: "AIzaSyD4G5asD5iqL4zb-hVwI37omTgczzMrlc8",
  authDomain: "timesheet-cfe7b.firebaseapp.com",
  databaseURL: "https://timesheet-cfe7b.firebaseio.com",
  projectId: "timesheet-cfe7b",
  storageBucket: "timesheet-cfe7b.appspot.com",
  messagingSenderId: "673077897727"
};

@NgModule({
  declarations: [AppComponent, SigninComponent, RegisterComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [EncrypService],
  bootstrap: [AppComponent]
})
export class AppModule {}
