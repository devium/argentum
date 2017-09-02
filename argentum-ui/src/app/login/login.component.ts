import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../common/rest-service/rest.service';
import { TokenResponse } from '../common/rest-service/response/token-response';
import { MessageComponent } from '../common/message/message.component';
import { UserResponse } from '../common/rest-service/response/user-response';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  @ViewChild(MessageComponent)
  message: MessageComponent;

  waitingForLogin = false;

  constructor(private restService: RestService, private router: Router) {
  }

  ngOnInit(): void {
    Observable.fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => {
      if (event.keyCode === 13 /* Enter */) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    this.waitingForLogin = true;

    this.restService.authenticate(this.username, this.password)
      .then(((response: TokenResponse) => {
        this.restService.getUser()
          .then((user: UserResponse) => {
            this.waitingForLogin = false;
            this.router.navigate(['/home']);
          })
          .catch(reason => {
            this.waitingForLogin = false;
            this.message.error(reason);
          });
      }))
      .catch((reason: string) => {
        this.waitingForLogin = false;
        this.message.error(reason);
      });
  }

}
