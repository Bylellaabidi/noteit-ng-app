import { EventInput } from '@fullcalendar/angular';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  
];

export function createEventId() {
  return String(eventGuid++);
}
/**
 * {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR,
    //end:TODAY_STR,
    allDay:false,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end:TODAY_STR+'T16:00:00'
  }
 */