import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { ModalConfigComponent } from './shared/modals/modal-config/modal-config.component';
import { Time } from './shared/interfaces/time';
import { TimeService } from './shared/services/time.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

	targetDate: Date = new Date();
	time: Time = { duration: 50 };
	faGear = faGear;
	message = 'This modal example uses the modalController to present and dismiss modals.';


	constructor(
		private modalCtrl: ModalController,
		private cdRef: ChangeDetectorRef,
		private timeService: TimeService
	) { }

	ngOnInit(): void {
		this.targetDate = new Date();
		this.targetDate.setHours(21, 51, 59, 999);
	}

	async openModal() {
		const modal = await this.modalCtrl.create({
			component: ModalConfigComponent,
		});
		modal.present();

		const { data, role } = await modal.onWillDismiss();

		if (role === 'confirm') {
			this.timeService.setTime(data as Time);
		}
		this.cdRef.detectChanges();
	}
}
