import { Component, OnInit } from '@angular/core';
import { IonDatetime, ModalController } from '@ionic/angular';
import { Time } from '../../interfaces/time';

@Component({
	selector: 'app-modal-config',
	templateUrl: './modal-config.component.html',
	styleUrls: ['./modal-config.component.scss'],
})
export class ModalConfigComponent {

	name: string = '';
	time: Time = { };
	minutes: number = 0;

	constructor(private modalCtrl: ModalController) { }

	cancel() {
		return this.modalCtrl.dismiss(null, 'cancel');
	}

	confirm() {
		return this.modalCtrl.dismiss(this.time, 'confirm');
	}


	confirmTime(event: Event) {
		const selectedTimeString = (event.target as unknown as IonDatetime).value as string; // Obtém o valor como string

    // Extrai os minutos da string (considerando o formato "HH:mm")
    const selectedMinutes = parseInt(selectedTimeString.split(':')[1], 10);

    this.time.duration = selectedMinutes ?? 0;
  }

}
