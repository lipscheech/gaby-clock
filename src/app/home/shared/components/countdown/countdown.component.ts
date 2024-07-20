import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	QueryList,
	viewChild,
	viewChildren,
	ViewChildren,
} from '@angular/core';
import { BehaviorSubject, interval, map, Subscription } from 'rxjs';
import { Time } from '../../interfaces/time';
import { TimeService } from '../../services/time.service';
import { TimerObject } from '../../interfaces/timer-object';
import { TipoTime } from '../../enums/tipo-time.enum';

@Component({
	selector: 'app-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() targetDate!: Date; // Data alvo para a contagem regressiva

	@ViewChildren('hours') viewChildrenHours!: ElementRef;
	@ViewChildren('minutes') viewChildrenMinutes!: ElementRef;
	@ViewChildren('seconds') viewChildrenSeconds!: ElementRef;
	@ViewChildren('timeSegment') timeSegments!: ElementRef;

	time: Time = { duration: 0 };
	timeLeft!: number;
	hours: number = 0;
	minutes: number = 0;
	minutesString: string[] = ['0', '0'];
	minutesStringBackup: string[] = ['0', '0'];
	subscription: Subscription = new Subscription();
	showAnimation = false;
	animationTimeout: any;
	timeBackup: number = 0;
	digits: any[] = [];
	previousDigits: any[] = [];
	timeObject: TimerObject[] = [
		{
			name: TipoTime.HOURS,
			time: 0,
			timeLeft: 0,
			showAnimation: false,
			animationTimeout: null,
		},
		{
			name: TipoTime.MINUTES,
			time: 0,
			timeLeft: 0,
			showAnimation: false,
			animationTimeout: null,
		},
		{
			name: TipoTime.SECONDS,
			time: 0,
			timeLeft: 0,
			showAnimation: false,
			animationTimeout: null,
		}
	];

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
					const timeDifference = this.timeLeft - Date.now();
					const totalSeconds = Math.max(0, Math.floor(timeDifference / 1000));

					this.timeObject[0].time = Math.floor(totalSeconds / 3600);
					this.timeObject[1].time = Math.floor((totalSeconds % 3600) / 60);
					this.timeObject[2].time = totalSeconds % 60;

					this.updateTime(TipoTime.HOURS, this.timeObject[0].time);
					this.updateTime(TipoTime.MINUTES, this.timeObject[1].time);
					this.updateTime(TipoTime.SECONDS, this.timeObject[2].time);
				})
			)
			.subscribe(); // Não precisa mais armazenar o timeLeft
	}

	updateTime(sectionID: string, timeValue: number) {
		const firstNumber = Math.floor(timeValue / 10) || 0;
		const secondNumber = timeValue % 10 || 0;

		const sectionElement = document.getElementById(sectionID);
		const timeSegment = sectionElement?.querySelectorAll('.time-segment') || [];
		this.updateTimeSegment(timeSegment[0], firstNumber);
		this.updateTimeSegment(timeSegment[1], secondNumber);

	}

	updateTimeSegment(segmentElement: any, timeValue: number) {
		const segmentElements = this.getTimeSegmentElements(segmentElement);

		if ( parseInt( segmentElements.segmentDisplayTop.textContent, 10) === timeValue) {
			return;
		}

		segmentElements.segmentOverlay.classList.add('flip');

	}


	getTimeSegmentElements(segmentElement: any) {
		const segmentDisplay = segmentElement.querySelector(
			'.segment-display'
		);
		const segmentDisplayTop = segmentDisplay.querySelector(
			'.segment-display__top'
		);
		const segmentDisplayBottom = segmentDisplay.querySelector(
			'.segment-display__bottom'
		);

		const segmentOverlay = segmentDisplay.querySelector(
			'.segment-overlay'
		);
		const segmentOverlayTop = segmentOverlay.querySelector(
			'.segment-overlay__top'
		);
		const segmentOverlayBottom = segmentOverlay.querySelector(
			'.segment-overlay__bottom'
		);

		return {
			segmentDisplayTop,
			segmentDisplayBottom,
			segmentOverlay,
			segmentOverlayTop,
			segmentOverlayBottom,
		};
	}

	setTime() {
		this.timeService.getTime().subscribe((time: Time) => {
			if (time?.duration)
				this.timeLeft = new Date().getTime() + time.duration * 60 * 1000;
			this.detectChanges();
		});
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

	ngAfterViewInit() {
		console.log(this.viewChildrenHours);

	}
}
