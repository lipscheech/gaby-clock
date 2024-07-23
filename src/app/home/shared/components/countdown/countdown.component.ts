import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {interval, map, Subscription} from 'rxjs';
import {Time} from '../../interfaces/time';
import {TimeService} from '../../services/time.service';
import {TimerObject} from '../../interfaces/timer-object';
import {TipoTime} from '../../enums/tipo-time.enum';

@Component({
	selector: 'app-countdown',
	templateUrl: './countdown.component.html',
	styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
	@Input() targetDate!: Date; //* Data alvo para a contagem regressiva
	@Input() timeObject: TimerObject[] = [
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

	time: Time = { duration: 0 };
	timeLeft!: number;
	hour: number = 0;
	minute: number = 0;
	second: number = 0;

	subscription: Subscription = new Subscription();

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

					if (!this.timeObject.length) {
						this.subscription.unsubscribe();
						return;
					}

					const timeDifference = this.timeLeft - Date.now();
					const totalSeconds = Math.max(0, Math.floor(timeDifference / 1000));

					this.hour = Math.floor(totalSeconds / 3600);
					this.minute = Math.floor((totalSeconds % 3600) / 60);
					this.second = totalSeconds % 60;

					this.updateTime(TipoTime.HOURS, this.hour);
					this.updateTime(TipoTime.MINUTES, this.minute);
					this.updateTime(TipoTime.SECONDS, this.second);
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

		if (!segmentElements) {
			return;
		}

		if (parseInt(segmentElements?.segmentDisplayTop?.textContent, 10) === timeValue) {
			return;
		}

		segmentElements?.segmentOverlay?.classList?.add('flip');

		this.updateSegmentValues(segmentElements?.segmentDisplayTop,
			segmentElements?.segmentOverlayBottom, timeValue);

		const finishAnimation = () => {
			segmentElements?.segmentOverlay?.classList?.remove('flip');
			this.updateSegmentValues(
				segmentElements?.segmentDisplayBottom,
				segmentElements?.segmentOverlayTop,
				timeValue
			);

			removeEventListener(
				'animationend',
				finishAnimation
			);
		}

		segmentElements.segmentOverlay.addEventListener(
			'animationend',
			finishAnimation
		);

	}


	getTimeSegmentElements(segmentElement: any) {
		if (!segmentElement) {
			return null;
		}

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

	updateSegmentValues(displayElement: any, overlayElement: any, value: any) {
		displayElement.textContent = value;
		overlayElement.textContent = value;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe(); // Cancela a inscrição para evitar vazamentos de memória
	}
}
