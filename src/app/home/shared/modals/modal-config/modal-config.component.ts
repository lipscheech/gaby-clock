import { TipoTimer } from './../../enums/tipo-time.enum';
import { Component, OnInit } from '@angular/core';
import { IonDatetime, ModalController, RangeCustomEvent } from '@ionic/angular';
import { Time } from '../../interfaces/time';

@Component({
	selector: 'app-modal-config',
	templateUrl: './modal-config.component.html',
	styleUrls: ['./modal-config.component.scss'],
})
export class ModalConfigComponent {

	name: string = '';
	time: Time = {};
	minutes: number = 0;
	typeTimer: string = TipoTimer.HOUR_MINUTES_SECONDS;
	maxTypeTimer: number = 0;
	TipoTimer = TipoTimer;
	HOUR_MINUTES_SECOND = TipoTimer.HOUR_MINUTES_SECONDS;
	HOUR_MINUTES = TipoTimer.HOUR_MINUTES;
	MINUTES_SECONDS = TipoTimer.MINUTES_SECONDS;
	MINUTES = TipoTimer.MINUTES;
	SECONDS = TipoTimer.SECONDS;

	constructor(private modalCtrl: ModalController) { }

	cancel() {
		return this.modalCtrl.dismiss(null, 'cancel');
	}

	confirm() {
		const hour = this.time?.hours != null ? this.time?.hours * 3600 : 0;
		const minutes = this.time?.minutes != null ? this.time?.minutes * 60 : 0;
		const seconds = this.time?.seconds ?? 0;
		this.time.duration =  hour + minutes + seconds;

		return this.modalCtrl.dismiss(this.time, 'confirm');
	}

	onIonChangeHour(ev: Event) {
		this.time.hours = ((ev as RangeCustomEvent).detail.value as number) ?? 0;
	}

	onIonChangeMinutes(ev: Event) {
		this.time.minutes = ((ev as RangeCustomEvent).detail.value as number) ?? 0;
	}

	onIonChangeSeconds(ev: Event) {
		this.time.seconds = ((ev as RangeCustomEvent).detail.value as number) ?? 0;
	}

	hasHours() {
		return this.typeTimer === this.HOUR_MINUTES_SECOND || this.typeTimer === this.HOUR_MINUTES;
	}

	hasMinutes() {
		return this.typeTimer === this.HOUR_MINUTES_SECOND || this.typeTimer === this.MINUTES_SECONDS
			|| this.typeTimer === this.HOUR_MINUTES || this.typeTimer === this.MINUTES;
	}

	hasSeconds() {
		return this.typeTimer === this.HOUR_MINUTES_SECOND || this.typeTimer === this.MINUTES_SECONDS
			|| this.typeTimer === this.SECONDS;
	}

}
