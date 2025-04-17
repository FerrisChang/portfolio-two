import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VerifiableCredentialDesc } from 'src/app/model/verifiable-credential-desc.model';
import { getStandardDatetimeString } from 'src/app/util/get-standard-datetime-string';
import { DateTimeChange } from '../../util/date-time-picker/date-time-picker.component';
import { TraceVocabService } from 'src/app/services/trace-vocab/trace-vocab.service';
import { vcTypeSearchParameters } from './vctype-search-parameters';
import { VerifiableCredentialType } from 'src/app/types/verifiable-credential-type';
import {
  MultiTextInputs,
  MultiTextOutputs,
} from '../../util/multi-text-inputs-form/multi-text-inputs-form.component';
import { LocalStateService } from 'src/app/services/local-state/local-state.service';

interface QuickDate {
  name: QuickDateKey;
  label: string;
}
type QuickDateKey =
  | ''
  | 'yesterday'
  | 'last-hour'
  | 'last-4-hours'
  | 'last-8-hours'
  | 'today'
  | 'yesterday'
  | 'last-4-days'
  | 'last-7-days'
  | 'last-30-days';

export interface FormPanelPersistence {
  verifiableCredentials: VerifiableCredentialDesc[];
  selectedVerifiableCredential: string;
  toDate: Date | null;
  toTime: string;
  fromDate: Date | null;
  fromTime: string;
  selectedQuickDate: QuickDateKey;
  filter: string;
}
@Component({
  selector: 'app-form-panel',
  templateUrl: './form-panel.component.html',
  styleUrls: ['./form-panel.component.scss'],
})
export class FormPanelComponent implements OnInit {
  verifiableCredentials: VerifiableCredentialDesc[] = [];

  vcTypeSearchParameters: MultiTextOutputs[] = [];

  quickDates: QuickDate[] = [
    {
      name: '',
      label: '',
    },
    {
      name: 'today',
      label: 'Today',
    },

    {
      name: 'last-hour',
      label: 'Last Hour',
    },
    {
      name: 'last-4-hours',
      label: 'Last 4 Hours',
    },
    {
      name: 'last-8-hours',
      label: 'Last 8 Hours',
    },
    {
      name: 'yesterday',
      label: 'Yesterday',
    },
    {
      name: 'last-4-days',
      label: 'Last 4 Days',
    },
    {
      name: 'last-7-days',
      label: 'Last 7 Days',
    },
    {
      name: 'last-30-days',
      label: 'Last 30 Days',
    },
  ];

  vcTypeInputs: MultiTextInputs[] = [];

  selectedVerifiableCredential: string = '';
  selectedQuickDate: QuickDateKey = '';
  from = getStandardDatetimeString(new Date(), '00:00');
  fromDate: Date | null = null;
  toDate: Date | null = null;
  fromTime = '00:00';
  toTime = '00:00';
  filter = '';

  tomorrow!: Date;
  today = new Date();

  to = getStandardDatetimeString(new Date(), '00:00');

  constructor(
    private router: Router,
    private traceVocabService: TraceVocabService,
    private localStateService: LocalStateService
  ) {}

  async ngOnInit() {
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.today.getDate() + 1);

    if (this.localStateService.getFormPanelContext()) {
      this.restoreState();
    } else {
      this.reset();

      this.traceVocabService.getVcTypes().subscribe((results) => {
        this.verifiableCredentials = [...results];
      });

      this.persistState();
    }
  }

  restoreState() {
    this.verifiableCredentials = [
      ...this.localStateService.getFormPanelContext()?.verifiableCredentials,
    ];
    this.toDate =
      this.localStateService.getFormPanelContext()?.toDate ?? new Date();
    this.toTime =
      this.localStateService.getFormPanelContext()?.toTime ?? '00:00';
    this.fromDate =
      this.localStateService.getFormPanelContext()?.fromDate ?? new Date();
    this.fromTime =
      this.localStateService.getFormPanelContext()?.fromTime ?? '00:00';

    this.from = getStandardDatetimeString(this.fromDate!, this.fromTime);
    this.to = getStandardDatetimeString(this.toDate!, this.toTime);

    this.selectedQuickDate =
      this.localStateService.getFormPanelContext()?.selectedQuickDate;
    this.selectedVerifiableCredential =
      this.localStateService.getFormPanelContext()?.selectedVerifiableCredential;
    this.filter = this.localStateService.getFormPanelContext()?.filter;

    console.log('restoreState', this.localStateService.getFormPanelContext());
  }

  persistState() {
    this.localStateService.setFormPanelContext({
      verifiableCredentials: [...this.verifiableCredentials],
      toDate: this.toDate,
      toTime: this.toTime,
      fromDate: this.fromDate,
      fromTime: this.fromTime,
      selectedVerifiableCredential: this.selectedVerifiableCredential,
      filter: this.filter,
      selectedQuickDate: this.selectedQuickDate,
    });
  }
// make spacific vc type params and inject into the query params object.
// create fileter for specific vc type params
  search() {
    this.persistState();
    
    const queryParams = {
      from: this.from,
      to: this.to,
      filter: this.filter,
      type: this.selectedVerifiableCredential,
      startingOffset: 0,
      limit: 25,
    };
    if 

    this.router.navigate(['/layout/search'], {
      queryParams,
    });
  }

  resetQuickDates() {
    this.selectedQuickDate = '';
  }
  fromDateChanged(dateChange: DateTimeChange) {
    this.from = getStandardDatetimeString(dateChange.date, dateChange.time);

    this.fromDate = dateChange.date;
    this.fromTime = dateChange.time;

    if (!this.toDate) {
      this.toDate = this.fromDate;
    }

    this.resetQuickDates();

    this.persistState();
  }

  toDateChanged(dateChange: DateTimeChange) {
    this.to = getStandardDatetimeString(dateChange.date, dateChange.time);

    this.toDate = dateChange.date;
    this.toTime = dateChange.time;

    if (!this.fromDate) {
      this.fromDate = this.toDate;
    }

    this.resetQuickDates();

    this.persistState();
  }

  setToToday() {
    const { date: todayDate, time: todayTime } = this.parseDateTime(new Date());
    this.toDate = todayDate;
    this.toTime = todayTime;
  }
  quickDateChanged() {
    switch (this.selectedQuickDate) {
      case 'yesterday': {
        // from
        const yesterday = new Date();
        yesterday.setDate(this.today.getDate() - 1);
        const { date: yesterdayDate } = this.parseDateTime(yesterday);
        this.fromDate = yesterdayDate;
        this.fromTime = '00:00';

        // to
        this.toDate = yesterday;
        this.toTime = '23:59';
        break;
      }
      case 'last-hour': {
        // from
        const pastHour = new Date();
        pastHour.setHours(this.today.getHours() - 1);
        const { date: pastHourDate, time: pastHourTime } =
          this.parseDateTime(pastHour);
        this.fromDate = pastHourDate;
        this.fromTime = pastHourTime;

        // to
        this.setToToday();
        break;
      }
      case 'last-4-hours': {
        // from
        const past4hours = new Date();
        past4hours.setHours(this.today.getHours() - 4);
        const { date: past4hoursDate, time: past4hoursTime } =
          this.parseDateTime(past4hours);
        this.fromDate = past4hoursDate;
        this.fromTime = past4hoursTime;

        // to
        this.setToToday();

        break;
      }
      case 'last-8-hours': {
        // from
        const past8hours = new Date();
        past8hours.setHours(this.today.getHours() - 8);
        const { date: past8hoursDate, time: past8hoursTime } =
          this.parseDateTime(past8hours);
        this.fromDate = past8hoursDate;
        this.fromTime = past8hoursTime;

        // to
        this.setToToday();
        break;
      }
      case 'today': {
        // from
        const yesterday = new Date();
        yesterday.setDate(this.today.getDate() - 1);
        const { date: todayDate, time: todayTime } = this.parseDateTime(
          this.today
        );
        this.fromDate = this.today;
        this.fromTime = '00:00';

        // to
        this.setToToday();
        break;
      }
      case 'last-4-days': {
        // from
        const past4days = new Date();
        past4days.setDate(this.today.getDate() - 4);
        const { date: past4DaysDate, time: past4DaysTime } =
          this.parseDateTime(past4days);
        this.fromDate = past4DaysDate;
        this.fromTime = past4DaysTime;

        // to
        this.setToToday();
        break;
      }
      case 'last-7-days': {
        // from
        const past7days = new Date();
        past7days.setDate(this.today.getDate() - 7);
        const { date: past7DaysDate, time: past7DaysTime } =
          this.parseDateTime(past7days);
        this.fromDate = past7DaysDate;
        this.fromTime = past7DaysTime;

        // to
        this.setToToday();
        break;
      }
      case 'last-30-days': {
        // from
        const past30days = new Date();
        past30days.setDate(this.today.getDate() - 30);
        const { date: past30DaysDate, time: past30DaysTime } =
          this.parseDateTime(past30days);
        this.fromDate = past30DaysDate;
        this.fromTime = past30DaysTime;

        // to
        this.setToToday();

        break;
      }
    }

    this.persistState();
  }

  parseDateTime(inputDate: Date) {
    if (!(inputDate instanceof Date || isNaN(inputDate))) {
      throw new Error('invalid date provided');
    }

    // set the date to 12:00 AM
    let date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);

    // extract time in 24-hour format
    let hours = inputDate.getHours().toString().padStart(2, '0');
    let minutes = inputDate.getMinutes().toString().padStart(2, '0');

    return {
      date,
      time: `${hours}:${minutes}`,
    };
  }
  reset() {
    this.fromDate = null;
    this.fromTime = '00:00';

    this.toDate = null;
    this.toTime = '23:59:59';

    this.selectedVerifiableCredential = '';
    this.vcTypeInputs = [];
    this.vcTypeSearchParameters = [];

    this.resetQuickDates();

    this.persistState();
  }


  onVcTypeChanged(vctype: VerifiableCredentialType) {
    this.vcTypeInputs = vcTypeSearchParameters[vctype];
    this.vcTypeSearchParameters = [];
  }

  onAddVcTypeSearchParameter(vcTypeSearchParameter: MultiTextOutputs) {
    this.vcTypeSearchParameters.push(vcTypeSearchParameter);
  }
}
