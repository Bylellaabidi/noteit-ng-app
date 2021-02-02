import { DateInput } from '@fullcalendar/core';

export interface Event {
    id:number;
    title:string;
    allDay:boolean
    startDate:Date|string;
    startHour?:string;
    endDate:Date|string
    endHour?:string;
  }