import {
    Component, Input, Output, OnChanges, SimpleChange, SimpleChanges,
    EventEmitter, ElementRef, ViewEncapsulation
} from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { isNullOrUndefined } from 'util';
import { TranslateService } from "@ngx-translate/core";
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
    @Input() disableFuture: boolean;
    @Output() onValueChange: EventEmitter<string> = new EventEmitter();

    constructor(private _eref: ElementRef, private translateService: TranslateService) {
        this.date = new Date();
        this.selectedDay = { dayValue: 0, dayText: '' };
        this.selectedMonth = { monthValue: 0, monthText: '' };
        this.selectedYear = { yearValue: 0, yearText: '' };
    }

    ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.data;
        if (!isNullOrUndefined(data)) {
            this.date = new Date(this.data);
            this.momentDate = moment(this.date, 'LLLL');
            this.getSelectedDateParameters(this.momentDate);
            this.getDays();
            this.getMonths();
            this.getYears();
        }
    }

    getSelectedDateParameters(momentDate) {
        this.selectedDay = { dayValue: momentDate.date(), dayText: momentDate.date().toString() };
        // month 0-11 . Get month name from moment  Jan -Dec
        this.selectedMonth = { monthValue: momentDate.month(), monthText: this.getMonthName((momentDate.month())) };
        this.selectedYear = { yearValue: momentDate.year(), yearText: momentDate.year().toString() };
    }

    onItemSelection() {
        const day = this.selectedDay['dayValue'];
        const month = this.selectedMonth['monthValue'];
        const year = this.selectedYear['yearValue'];
        // e. g. 7 Feb 2017 => label: Feb value: 1
        this.selectedDate = new Date(year, month, day);
        console.log(JSON.stringify(moment(this.selectedDate).format()));
        this.onValueChange.emit(moment(this.selectedDate).format());
    }


    private getDays() {
        this.days = [];
        const days = this.momentDate.daysInMonth();
        for (let i = 1; i <= days; i++) {
            this.days.push({ dayValue: i, dayText: i.toString() });
        }
    }

    private getMonths() {
        const lang = this.translateService.currentLang;
        moment.locale(lang);
        this.months = [];
        this.months = moment.monthsShort().map((month, i) => {
            return { monthValue: i, monthText: month };
        });
    }

    private getMonthName(month) {
        const months = Array.apply(0, new Array(12)).map(function (_, i) {
            return moment().month(i).format('MMM');
        });
        return months[month];
    }

    private getYears() {
        if (this.years.length === 0) {
            const currentYear = this.momentDate.year();
            this.years = [];
            let years = 0;
            if (this.disableFuture) {
                years = currentYear - 90;
                for (let i = currentYear; i >= years; i--) {
                    this.years.push({ yearValue: i, yearText: i.toString() });
                }
            } else {
                years = currentYear + 60;
                for (let i = currentYear; i <= years; i++) {
                    this.years.push({ yearValue: i, yearText: i.toString() });
                }
            }
        }
    }
}
