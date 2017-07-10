import {
    Component, Input, Output, OnChanges, SimpleChange, SimpleChanges,
    EventEmitter, ElementRef, ViewEncapsulation
} from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';

@Component({
    providers: [DatePipe],
    selector: 'custom-calender',
    templateUrl: './custom-calender.component.html',
    styleUrls: ['./custom-calender.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CustomCalenderComponent implements OnChanges {

    date: Date;
    days: any[] = [];
    isEmptyDay: boolean;
    isEmptyMonth: boolean;
    isEmptyYear: boolean;
    momentDate: moment.Moment;
    months: any[] = [];
    selectedDate: Date;
    selectedDay = {};
    selectedMonth = {};
    selectedYear = {};
    years: any[] = [];


    @Input() themeClass: string;
    @Input() data: Date;
    @Output() onValueChange: EventEmitter<Date> = new EventEmitter();

    constructor(private _eref: ElementRef) {
        this.date = new Date();
        this.selectedDay = { dayValue: 0, dayText: '' };
        this.selectedMonth = { monthValue: 0, monthText: '' };
        this.selectedYear = { yearValue: 0, yearText: '' };
    }

    ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.data;
        if (!isNullOrUndefined(data)) {
            this.date = this.data;
            this.momentDate = moment(this.date);
            this.getSelectedDateParameters(this.momentDate);
            this.getDays();
            this.getMonths();
            this.getYears();
        }
    }

    getSelectedDateParameters(momentDate) {
        this.selectedDay = { dayValue: momentDate.date(), dayText: momentDate.date().toString() };
        this.selectedMonth = { monthValue: momentDate.month() + 1, monthText: (momentDate.month() + 1).toString() };
        this.selectedYear = { yearValue: momentDate.year(), yearText: momentDate.year().toString() };
    }

    onItemSelection() {
        const day = this.selectedDay['dayValue'];
        const month = this.selectedMonth['monthValue'] - 1;
        const year = this.selectedYear['yearValue'];
        this.selectedDate = new Date(year, month, day);
        console.log(this.selectedDate);
        this.onValueChange.emit(this.selectedDate);
    }


    private getDays() {
        //clear dropdown first
        this.days = [];
        const days = this.momentDate.daysInMonth();
        for (let i = 1; i <= days; i++) {
            this.days.push({ dayValue: i, dayText: i.toString() });
        }
    }

    private getMonths() {
        //clear dropdown first
        this.months = [];
        for (let i = 1; i <= 12; i++) {
            this.months.push({ monthValue: i, monthText: i.toString() });
        }
    }

    private getYears() {
        if (this.years.length === 0) {
            //clear dropdown first
            const currentYear = this.momentDate.year();
            this.years = [];
            const years = currentYear + 10;
            for (let i = currentYear; i <= years; i++) {
                this.years.push({ yearValue: i, yearText: i.toString() });
            }
        }
    }

}
