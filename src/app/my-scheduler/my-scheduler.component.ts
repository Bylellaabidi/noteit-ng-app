
import { TokenStorageService } from './../shared/token-storage.service';
import {Router} from "@angular/router"
import { ApiService } from './../shared/api.service';
import { Event } from './../notes/model/event';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventSourceInput, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-my-scheduler',
  templateUrl: './my-scheduler.component.html',
  styleUrls: ['./my-scheduler.component.css']
})
export class MySchedulerComponent implements OnInit {


  /**
   * var , const declaration
   */
  editable: boolean = false;
  TODAY = new Date().toISOString();
  TODAY_STR = this.TODAY.substr(0, this.TODAY.indexOf('T'));
  addEvent: Event =
    {
      id: 0,
      title: null,
      allDay: null,
      startDate: null,
      startHour: null,
      endDate: null,
      endHour: null
    };

  myEvents: Event[] = [];
  dayEvents: EventInput[] = [];
  myAddEvent: EventInput[] = [
    {

      id: createEventId(),
      title: 'All-day event',
      start: '2020-12-01T09:00:00.000',
      end: '2020-12-01T11:00:00.000',
      allDay: false,

    }
  ]
  selectInfo: DateSelectArg;
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: [],      // initialEvents: INITIAL_EVENTS, alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    slotMaxTime: "18:00:00",
    slotMinTime: "08:00:00",
    timeZone : 'local',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    //eventDrop:null,
    //eventDragStart:null,
    //eventDrop: this.handleEventDrop.bind(this),
    //eventResize: this.handleResize.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  closeResult = '';

  startHour = "08:00"
  endHour = "18:00"
  isLoggedIn = true;
user:any;
  @ViewChild('myModal') myModal: any;
  @ViewChild('content') editModal: any;
  /**
   * Constructor
   * @param apiService 
   * @param modalService 
   */
  constructor(private apiService: ApiService, private modalService: NgbModal,
    public datepipe: DatePipe, private cdRef: ChangeDetectorRef,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private _flashMessagesService: FlashMessagesService) { }

  /**
   * Init Function 
   */
  ngOnInit(): void {


     
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn )
    {
      this.getAllEvents();
       this.user = this.tokenStorageService.getUser();
   }
    else
    {
      this.router.navigate(['/login']);
    }
    
  }

  /**
   * FullCalendar Event Functions
   */

  handleResize(info) {
    let str = '';
    var date = new Date();
date.setDate(info.event.end.getDate() - 1);
    str = date.toString()
    alert(info.event.title + " end is now " + str.substr(0, str.indexOf(":") - 2));
    if (!confirm("is this okay?")) {
      info.revert();
    }
    else
    {
      this.addEvent =
      {
        id: info.event.id,
        title: info.event.title,
        allDay: info.event.allDay,
        startDate: info.event.start,
        endDate: info.event.end
      }
      this.apiService.saveEvent(this.addEvent).subscribe(
        res => {
          this._flashMessagesService.show('Event updated', { cssClass: 'alert-success', timeout: 2000 });

        },
        err => {
          //alert("An error occurred while saving the Event");
          this._flashMessagesService.show('An error occurred while saving the Event', { cssClass: 'alert-danger', timeout: 2000 });
        });

    }
  }
  handleEventDrop(info) {

    let str = '';
    str = info.event.start.toString();
    this.addEvent =
    {
      id: info.event.id,
      title: info.event.title,
      allDay: info.event.allDay,
      startDate: info.event.start,
      endDate: info.event.end
    }

    alert(info.event.title + " was dropped on " + str.substr(0, str.indexOf(":") - 2));

    if (!confirm("Are you sure about this change?")) {

      info.revert();
    }
    else {
      this.apiService.saveEvent(this.addEvent).subscribe(
        res => {
          this._flashMessagesService.show('Event updated', { cssClass: 'alert-success', timeout: 2000 });

        },
        err => {
          //alert("An error occurred while saving the Event");
          this._flashMessagesService.show('An error occurred while saving the Event', { cssClass: 'alert-danger', timeout: 2000 });
        });
    }
  }


  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    //const title = prompt('Please enter a new title for your event');
    let strDate: string = '';
    this.dayEvents = [];
    const calendarApi = selectInfo.view.calendar;

    for (let i = 0; i < this.myAddEvent.length; i++) {
      const element = this.myAddEvent[i];
      strDate = element.start.toString().substr(0, element.start.toString().indexOf('T'))
      if (strDate === selectInfo.startStr) {
        if (!this.dayEvents.includes(element)) {
          this.dayEvents.push(
            element
          )
        }
      }
    }
    this.addEvent.startDate = selectInfo.start;
    this.openModal();

  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log("drag from Event Click")
    for (let j = 0; j < this.myAddEvent.length; j++) {
      const element = this.myAddEvent[j];
      if (element.id == clickInfo.event.id) {
        this.addEvent =
        {
          id: Number(element.id),
          title: element.title,
          allDay: element.allDay,
          startDate: element.allDay ? clickInfo.event.startStr : clickInfo.event.startStr.substr(0, clickInfo.event.startStr.indexOf("T")),
          endDate: element.allDay ? element.end.toString().substr(0, element.end.toString().indexOf("T")) : clickInfo.event.endStr.substr(0, clickInfo.event.endStr.indexOf("T"))
        }
        if (!element.allDay) {
          this.startHour = clickInfo.event.startStr.substr(clickInfo.event.startStr.indexOf("T") + 1, 5);
          this.endHour = clickInfo.event.endStr.substr(clickInfo.event.endStr.indexOf("T") + 1, 5)
        }
        break;
      }
    }

    this.editable = true;
    this.modalService.open(this.editModal);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.cdRef.detectChanges();
  }
  /***
   * Input validation control
   */

  valideDate(startDate: Date, endDate: Date): boolean {
    let validDate: boolean = true;
    if (startDate != null && endDate != null) {
      if (startDate > endDate) {
        validDate = false
      }
    }
    return validDate;
  }
  validateHours(startD: Date, endD: Date, startH: any, endH: any): boolean {
    let valide = true;
    if (startD == endD) {
      if (endH < startH) {
        valide = false;
      }
    }
    return valide;
  }
  /**
   * Modal and Ng-Template Function
   */
  openModal() {
    this.modalService.open(this.myModal);
  }

  open(content) {

    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  /**
   * 
   * Crud Event Functions
   */


  getAllEvents() {
    this.apiService.getAllEvents().subscribe
      (
        res => {
          this.myEvents = res;
          for (let i = 0; i < this.myEvents.length; i++) {

            this.myAddEvent.push(
              {
                id: this.myEvents[i].id.toString(),
                title: this.myEvents[i].title,
                start: this.myEvents[i].startDate,
                //T.substr(0,T.indexOf("T"))+E.substr(E.indexOf("T")),
                end: this.myEvents[i].endDate,
                allDay: this.myEvents[i].allDay,
                //backgroundColor: 'rgb(201, 76, 76)',//'#A0A8A0',
                // textColor: 'rgb(102, 67, 67)',


              }
            )

          }
          this.calendarOptions.events = this.myAddEvent;
        },
        err => { alert("Error occurred while downloading the events;") }
      );

  }
  AddEvent() {
    this.calendarOptions.events = []
    if (this.addEvent != null) {
      if (this.editable) {
        this.myAddEvent = this.eventExist(this.myAddEvent, this.addEvent);
      }
      if (!this.addEvent.allDay && (this.startHour != null && this.endHour != null)) {

        this.addEvent.startDate = new Date(this.addEvent.startDate + "T" + this.startHour + ":00.000+00:00")
        this.addEvent.endDate = new Date(this.addEvent.endDate + "T" + this.endHour + ":00.000+00:00")
      }
      this.apiService.saveEvent(this.addEvent).subscribe(
        res => {
          this.myAddEvent.push(
            {
              // testCondition ? value1 : value2
              id: res.id.toString(),
              title: res.title,
              allDay: res.allDay,
              start: res.startDate,
              end: res.endDate
            }
          )
          this.calendarOptions.events = this.myAddEvent;
          if (!this.editable)
            this._flashMessagesService.show('Event added to the Calendar', { cssClass: 'alert-success', timeout: 2000 });
          else
            this._flashMessagesService.show('Event updated', { cssClass: 'alert-success', timeout: 2000 });

        },
        err => {
          //alert("An error occurred while saving the Event");
          this._flashMessagesService.show('An error occurred while saving the Event', { cssClass: 'alert-danger', timeout: 2000 });
        });


    }
    this.addEvent = {
      id: 0,
      title: "",
      allDay: null,
      startDate: null,
      endDate: null
    };
    this.modalService.dismissAll();
  }
  eventExist(array: any[], elt: any): any[] {
    let index = 0
    for (let i = 0; i < array.length; i++) {
      ;
      if (array[i].id == elt.id) {
        index = i;
        break;
      }

    }
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }
  getArrayId(arg: any[]): number[] {
    var ids: number[] = [];
    for (let i = 0; i < arg.length; i++) {
      const element = arg[i];
      if (!ids.includes(element.id)) {
        ids.push(element.id);
      }

    }
    return ids;
  }

  deleteEvent() {
    this.calendarOptions.events = [];
    let deletedEvent: EventInput = {
      id: this.addEvent.id.toString(),
      title: this.addEvent.title,
      allDay: this.addEvent.allDay,
      startDate: this.addEvent.startDate,
      endDate: this.addEvent.endDate

    }
    let index = 0
    for (let i = 0; i < this.myAddEvent.length; i++) {
      const element = this.myAddEvent[i];
      if (element.id == deletedEvent.id) {
        index = i;
        break;
      }

    }
    if (index > -1) {
      this.myAddEvent.splice(index, 1);


    }
    this.apiService.deleteEvent(this.addEvent.id).subscribe(
      res => {
        this.calendarOptions.events = this.myAddEvent;
        this._flashMessagesService.show('Event deleted from your Calendar', { cssClass: 'alert-success', timeout: 2000 });
      },
      err => {
        this._flashMessagesService.show('An error occurred while deleting the Event', { cssClass: 'alert-danger', timeout: 2000 });
      });

    this.modalService.dismissAll();
    this.addEvent = {
      id: 0,
      title: "",
      allDay: null,
      startDate: null,
      endDate: null
    };
    this.editable = false;
  }

}


