import { ApiService } from './shared/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotesComponent } from './notes/notes.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {Router, RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { NoteComponent } from './notes/note/note.component';
import { NoteTextFilterPipe } from './shared/note-text-filter.pipe';
import { MySchedulerComponent } from './my-scheduler/my-scheduler.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // a plugin
import listPlugin from '@fullcalendar/list';
import timeGridWeek from '@fullcalendar/timegrid';
import timeGridDay from '@fullcalendar/timegrid';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { TodayComponent } from './today/today.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
  listPlugin,
  timeGridDay,
  timeGridWeek
]);

const appRoutes :Routes = [
  {
    path:'today',
    component:TodayComponent
  },
  {
    path:'notes',
    component:NotesComponent
  },
  {
    path:'feedback',
    component:FeedbackComponent
  },
  {
    path:'schedule',
    component:MySchedulerComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'',
    component:TodayComponent,
    pathMatch:'full'
  },
  {
    path:'**',
    component:TodayComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FeedbackComponent,
    NotesComponent,
    NotFoundComponent,
    NoteComponent,
    NoteTextFilterPipe,
    MySchedulerComponent,
    TodayComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, {enableTracing:true}),
    FullCalendarModule,
    FlashMessagesModule.forRoot(),
    NgbModule
    
  ],
  providers: [DatePipe,ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
