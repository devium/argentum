import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../common/rest-service/rest.service';
import { TokenResponse } from '../common/rest-service/response/token-response';
import { MessageComponent } from '../common/message/message.component';
import { UserResponse } from '../common/rest-service/response/user-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";

  @ViewChild(MessageComponent)
  message: MessageComponent;

  waitingForLogin = false;

  constructor(private restService: RestService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.waitingForLogin = true;

    this.restService.authenticate(this.username, this.password)
      .then(((response: TokenResponse) => {
        this.restService.getUser()
          .then((user: UserResponse) => {
            this.router.navigate(['/home']);
          })
          .catch(reason => {
            this.waitingForLogin = false;
            this.message.error(`Error: ${reason}`);
          });
      }))
      .catch(reason => {
        this.waitingForLogin = false;
        this.message.error(`Error: ${reason}`);
      });
  }

}
