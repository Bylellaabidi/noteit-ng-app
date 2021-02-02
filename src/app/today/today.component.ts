
import { TokenStorageService } from './../shared/token-storage.service';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './../login/login.component';
import { Notebook } from './../notes/model/notebook';
import { ApiService } from './../shared/api.service';
import { Component, OnInit } from '@angular/core';
import { Event } from './../notes/model/event';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../notes/model/note';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from "@angular/router"

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit {
  notebooks: Notebook[] = [];
  islogged: boolean = false;
  TODAY_STR = new Date().toUTCString().substr(0, new Date().toUTCString().indexOf(":") - 3);
  notes: Note[] = [];
  myEvents: Event[] = [
    {
      id: 0,
      title: "test",
      startDate: this.TODAY_STR,
      endDate: this.TODAY_STR,
      allDay: true
    },
  ];
  todayEvents = [];
  isLoggedIn = true;
  role: string = '';
  user: any;
  constructor(private apiService: ApiService,
    private tokenStorageService: TokenStorageService,
    private modalService: NgbModal,
    private router: Router,
    private datePipe: DatePipe,
    private _flashMessagesService: FlashMessagesService) { }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.getAllEvents();

      this.getAllNotes();
      this.user = this.tokenStorageService.getUser();
      //console.log(this.user)
      this.role = this.user.roles[0];

      this.role = this.role.substr(this.role.indexOf('_') + 1)
      //console.log(this.role);
      this._flashMessagesService.show(' Logged in as ' + this.role, { cssClass: 'alert-success', timeout: 2000 });

      
    }
    else {
      this.router.navigate(['/login']);
    }




  }

  getAllNotes() {
    this.apiService.getAllNotes().subscribe(
      res => {
        this.notes = res;
        //console.log(res)
      },
      err => { alert("Error occurred while downloading the notes;") }
    );
  }


 

  getAllEvents() {
    let sdate = new Date();
    let edate = new Date();
    
    this.apiService.getAllEvents().subscribe
      (
        res => {
          for (let i = 0; i < res.length; i++) {
          
            sdate = new Date(res[i].startDate);
            edate = new Date(res[i].endDate);
            
            if(!res[i].allDay)
            {
             
              res[i].startHour=sdate.toUTCString().substr(sdate.toUTCString().indexOf(":")-2, 5);
              res[i].endHour=edate.toUTCString().substr(edate.toUTCString().indexOf(":")-2, 5)
              
            }
            if(this.isTodayEvents(sdate,edate))
            {
              this.todayEvents.push(res[i]);
              
            }
            res[i].startDate = sdate.toUTCString().substr(0, sdate.toUTCString().indexOf(":") - 3);
            res[i].endDate = edate.toUTCString().substr(0, edate.toUTCString().indexOf(":") - 3);
           
            this.myEvents.push(res[i]);

            

          }
        },
        err => { alert("Error occurred while downloading the events;") }
      );
    console.log(this.todayEvents)
  }
 
  public setBackColor(allday: boolean): any {
    let styles = {
      'background-color': '#26cfc1'
    };
    if (!allday) {
      styles = {
        'background-color': '#e4ecf0'
      }
    }

    return styles;
  }
 
  isTodayEvents(sdate:Date, edate:Date):boolean{

    let valide=true;
    console.log(sdate.getFullYear())
    console.log(edate.getFullYear())
    console.log(new Date().getFullYear());
    if(edate.getFullYear() < new Date().getFullYear())
    {
      valide =false;
    }
    else if(edate.getMonth() < new Date().getMonth())
    {
      valide =false;
    }
    else if( edate.getDay() < new Date().getDay())
    {
      valide =false;
    }
    
    
    return valide
  }
}
