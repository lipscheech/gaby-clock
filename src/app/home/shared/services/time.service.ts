import { Injectable } from '@angular/core';
import { Time } from '../interfaces/time';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
	private timeSubject = new BehaviorSubject<Time>({});
  constructor() { }

	setTime(time: Time) {
		this.timeSubject.next(time);
	}

	getTime() {
		return this.timeSubject.asObservable();
	}
}
