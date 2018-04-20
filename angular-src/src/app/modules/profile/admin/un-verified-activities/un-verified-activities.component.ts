import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Http, Headers} from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routerTransition} from '../router.animations';
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-un-verified-activities',
  templateUrl: './un-verified-activities.component.html',
  styleUrls: ['./un-verified-activities.component.scss'],
  animations: [routerTransition()]
})
export class UnVerifiedActivitiesComponent implements OnInit {
  public unVerifiedActivitiesList = [];
  public user;
  public activity;
  constructor(private httpClient: HttpClient,
              private http: Http,
              private router: Router,
              private auth: AuthService) { }

  ngOnInit() {
    let autorization = {Authorization: localStorage.getItem('authentication')};
    this.httpClient.get('http://localhost:3000/api/activity/viewUnverifiedActivities', {headers: autorization})
      .subscribe((res: any) => {
        this.unVerifiedActivitiesList = res.data;
      }, err => {
        new Noty({
          type: 'error',
          text: err.error.msg,
          timeout: 3000,
          progressBar: true
        }).show();
      });

  }

  verifyActivity(activityId,hostId) {
    let autorization = {Authorization: localStorage.getItem('authentication')};
    this.httpClient.get('http://localhost:3000/api/user/verifyActivity/' + activityId, {headers: autorization})
      .subscribe((res: any) => {
        this.activity = res.data;
        new Noty({
          type: 'success',
          text: res.msg,
          timeout: 3000,
          progressBar: true
        }).show();
        this.ngOnInit();
      }, err => {
        new Noty({
          type: 'error',
          text: err.error.msg,
          timeout: 3000,
          progressBar: true
        }).show();
      });
      let notification={
        title:'Activity Verification',
        description:'Congratulations:Your Activity has been verified you can find it on the Activities page',
        url:'/event/view',
        recieving_user_id:hostId
      }
      this.httpClient.post('http://localhost:3000/api/notifications/create',notification,{headers: autorization} ).subscribe(
        (res: any) => {
        },
        err=> {
         
        });
  }
  rejectActivity(activityId,hostId) {
    let autorization = {Authorization: localStorage.getItem('authentication')};
    this.httpClient.delete('http://localhost:3000/api/user/rejectActivity/' + activityId, {headers: autorization})
      .subscribe((res: any) => {
        new Noty({
          type: 'success',
          text: res.msg,
          timeout: 3000,
          progressBar: true
        }).show();
        this.ngOnInit();
      }, err => {
        new Noty({
          type: 'error',
          text: err.error.msg,
          timeout: 3000,
          progressBar: true
        }).show();
      });
      let notification={
        title:'Activity Verification',
        description:'Sorry:Your Activity has been rejected',
        url:'/event/myactivities/view',
        recieving_user_id:hostId
      }
      this.httpClient.post('http://localhost:3000/api/notifications/create',notification,{headers: autorization} ).subscribe(
        (res: any) => {
        },
        err=> {
         
        });
  }
  isAdmin() {
    if (this.auth.getCurrentUser().role == 'Admin') {
      return true;
    }
    return false;
  }
}