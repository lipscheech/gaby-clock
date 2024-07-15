import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CountdownComponent } from './shared/components/countdown/countdown.component';
import { ModalConfigComponent } from './shared/modals/modal-config/modal-config.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		FontAwesomeModule
	],
	declarations: [HomePage, CountdownComponent, ModalConfigComponent]
})
export class HomePageModule { }
