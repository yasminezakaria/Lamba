import {Component, OnInit} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {Http, Headers} from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpModule, Response} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-verify-teacher',
  templateUrl: './verify-teacher.component.html',
  styleUrls: ['./verify-teacher.component.css'],
  animations: [routerTransition()]

})
export class VerifyTeacherComponent implements OnInit {

  public Teachers = [];
  authorization = {Authorization: localStorage.getItem('authentication')};


  constructor(private httpClient: HttpClient,
              private http: Http,
              private router: Router) {

  }

  ngOnInit() {
    this.httpClient.get('api/admin/teachers_verfication', {headers: this.authorization})
      .subscribe((res: any) => {
        this.Teachers = res.data;
      }, err => {
        new Noty({
          type: 'error',
          text: err.error.msg,
          timeout: 2000,
          progressBar: true
        }).show();
      });
  }

  Accept(teacherID) {
    this.httpClient.get('api/admin/accept_teacher/' + teacherID, {headers: this.authorization})
      .subscribe(res => {
        new Noty({
          type: 'success',
          text: 'Teacher Verified Successfully',
          timeout: 2000,
          progressBar: true
        }).show();
        this.ngOnInit();
      },
        err => {
          new Noty({
            type: 'error',
            text: err.error.msg,
            timeout: 2000,
            progressBar: true
          }).show();
        });
        let notification={
          title:'Verification',
          description:'Congratulations:You are now a verified teacher',
          url:'/profile/'+teacherID,
          recieving_user_id:teacherID
        }
        this.httpClient.post('api/notifications/create',notification,{headers: this.authorization} ).subscribe(
          (res: any) => {
          },
          err=> {
           
          });      
  }
  Decline(teacherID) {
    this.httpClient.get('api/admin/decline_teacher/' +  teacherID, {headers: this.authorization})
    .subscribe(res => {
       new Noty({
        type: 'success',
        text: 'Teacher Rejected Successfully',
        timeout: 2000,
        progressBar: true
      }).show();
      this.ngOnInit();
    },
      err => {
        new Noty({
          type: 'error',
          text: err.error.msg,
          timeout: 2000,
          progressBar: true
        }).show();
      });
      let notification={
        title:'Verification',
        description:'Sorry:You have been rejected',
        url:'/profile/'+teacherID,
        recieving_user_id:teacherID
      }
      this.httpClient.post('api/notifications/create',notification,{headers: this.authorization} ).subscribe(
        (res: any) => {
        },
        err=> {
         
        }); 

    }
}
