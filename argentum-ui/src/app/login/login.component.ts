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
  }

  onSubmit() {
    this.waitingForLogin = true;
    // TODO REMOVE
    console.log('AAAAAAAAAAAAH');

    this.restService.authenticate(this.username, this.password)
      .then(((response: TokenResponse) => {
        this.router.navigate(['/home']);
        this.waitingForLogin = false;
      }))
      .catch((reason: string) => {
        this.waitingForLogin = false;
        this.message.error(reason);
      });
  }

}
