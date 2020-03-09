import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageComponent} from '../common/message/message.component';
import {Router} from '@angular/router';
import {LoginService} from '../common/rest-service/login.service';
import {environment} from '../../environments/environment';

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

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.waitingForLogin = true;

    this.loginService.login(this.username, this.password)
      .subscribe(
        (token: string) => {
          this.router.navigate(['/home']);
          this.waitingForLogin = false;
        }, (err: string) => {
          this.waitingForLogin = false;
          // Hack: the processErrors error handler is tailored to django error messages. This happens when the backend is unreachable.'
          if (err === 'true') {
            this.message.error(
              `Unable to reach server. <a href="${environment.apiUrl}" target="_blank">Click to check API connection manually.</a>`
            );
          } else {
            this.message.error(err);
          }
        }
      );
  }

}
