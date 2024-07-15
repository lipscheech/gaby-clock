import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, map, Subscription } from 'rxjs';
import { Time } from '../../interfaces/time';
import { TimeService } from '../../services/time.service';

@Component({
	selector: 'app-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {

	@Input() targetDate!: Date; // Data alvo para a contagem regressiva
	time: Time = { duration: 0 };
	timeLeft!: number
	hours: number = 0;
	minutes: number = 0;
	minutesString: string[] = ['0', '0'];
	minutesStringBackup: string[] = ['0', '0'];
	subscription: Subscription = new Subscription();
	showAnimation = false;
  animationTimeout: any;
	timeBackup: number = 0;

	constructor(
		private cdref: ChangeDetectorRef,
		private timeService: TimeService
	) { }

	detectChanges = () => this.cdref.detectChanges();

	ngOnInit() {
		this.setTime();
		this.subscription = interval(1000)
			.pipe(
				map(() => {
					const timeDifference = this.timeLeft - new Date().getTime();
					const totalSeconds = Math.max(0, Math.floor(timeDifference / 1000));

					this.hours = Math.floor(totalSeconds / 3600);
					this.minutes = Math.floor((totalSeconds % 3600) / 60);
					if(this.minutesStringBackup[1] !== this.minutesString[1]) {
						this.showAnimation = true;
						this.resetAnimation();
						this.minutesStringBackup = this.minutesString;
					}
					this.updateTime(totalSeconds);
				})
			)
			.subscribe(); // Não precisa mais armazenar o timeLeft
	}

	updateTime(minutes: number) {
		if (minutes) {
			minutes > 10 ? this.minutesString = minutes.toString().split('') : this.minutesString = ['0', minutes.toString()];
		} else {
			this.minutesString = ['0', '0'];
		}
	}

	setTime() {
		this.timeService.getTime().subscribe((time: Time) => {
			if (time?.duration)
				this.timeLeft = new Date().getTime() + time.duration * 60 * 1000;
			this.detectChanges();
		})
	}

	resetAnimation() {
    clearTimeout(this.animationTimeout); // Limpa o timeout anterior (se houver)

    this.animationTimeout = setTimeout(() => {
      this.showAnimation = false; // Desativa a animação
    }, 500); // Atraso de 1 segundo para reiniciar a animação (ajuste conforme necessário)
  }

	ngOnDestroy() {
		this.subscription.unsubscribe(); // Cancela a inscrição para evitar vazamentos de memória
	}
}
