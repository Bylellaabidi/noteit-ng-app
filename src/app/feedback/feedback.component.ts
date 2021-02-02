import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../shared/api.service";
import { TokenStorageService } from './../shared/token-storage.service';
import {Router} from "@angular/router"
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  model: FeedbackViewModel = {
    name: '',
    email: '',
    feedback: ''
  };
  isLoggedIn = true;
user:any;
  constructor(private apiService: ApiService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private _flashMessagesService: FlashMessagesService) {
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn )
    {
      
       this.user = this.tokenStorageService.getUser();
   }
    else
    {
      this.router.navigate(['/login']);
    }
    
  }

  sendFeedback(): void {
    this.apiService.postFeedback(this.model).subscribe(
      res => {
        location.reload();
        this._flashMessagesService.show(' Mail sended ' ,  { cssClass: 'alert-success', timeout: 2000 });

      },
      err => {
        alert("An error has occurred while sending feedback");
      }
    );
  }

}

export interface FeedbackViewModel {
  name: string;
  email: string;
  feedback: string;
}