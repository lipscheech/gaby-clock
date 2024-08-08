import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { ModalConfigComponent } from './shared/modals/modal-config/modal-config.component';
import { Time } from './shared/interfaces/time';
import { TimeService } from './shared/services/time.service';
import { TimerObject } from './shared/interfaces/timer-object';
import { TipoTime } from './shared/enums/tipo-time.enum';
import { CountdownComponent } from './shared/components/countdown/countdown.component';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

	@ViewChild('countdown') countdown!: CountdownComponent;

	targetDate: Date = new Date();
	time: Time = { duration: 50 };
	faGear = faGear;

	HOUR = TipoTime.HOURS;
	MINUTES = TipoTime.MINUTES;
	SECONDS = TipoTime.SECONDS;

	timeObject: TimerObject[] = [
		{
			name: TipoTime.SECONDS,
			time: 0,
		}
	]


	constructor(
		private modalCtrl: ModalController,
		private cdRef: ChangeDetectorRef,
		private timeService: TimeService
	) { }

	ngOnInit(): void {
		this, this.timeService.setTime({ duration: 5 });
	}

	async openModal() {
		const modal = await this.modalCtrl.create({
			component: ModalConfigComponent,
		});
		modal.present();

		const { data, role } = await modal.onWillDismiss();

		if (role === 'confirm') {
			const time = data as Time;
			let newTimeObject: TimerObject[] = [];
			if (time.hours != null && time.hours > 0) {
				newTimeObject.push({
					name: this.HOUR,
				});
			}
			if (time.minutes != null && time.minutes > 0) {
				newTimeObject.push({
					name: this.MINUTES,
				});
			}

			if (time.seconds != null && time.seconds > 0) {
				newTimeObject.push({
					name: this.SECONDS,
				});
			}

			if (!!newTimeObject.length) {
				this.timeObject = newTimeObject;
			}

			this.timeService.setTime(data as Time);
		}
		this.cdRef.detectChanges();
	}

	startCountdown() {
		this.countdown?.playCountdown();
	}
}
