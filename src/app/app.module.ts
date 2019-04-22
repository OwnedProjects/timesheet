import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { EncrypService } from './encryp.service';
import { DashboardComponent } from './dashboard/dashboard.component';

let config: any = {
	apiKey: 'AIzaSyDxWCWPvHHW_oDnZcC_IPq6t2ak0VuWZNM',
	authDomain: 'timedb.firebaseapp.com',
	databaseURL: 'https://timedb.firebaseio.com',
	projectId: 'timedb',
	storageBucket: 'timedb.appspot.com',
	messagingSenderId: '653968403495'
};

@NgModule({
	declarations: [ AppComponent, SigninComponent, RegisterComponent, DashboardComponent ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(config),
		AngularFirestoreModule,
		FormsModule
	],
	providers: [ EncrypService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
