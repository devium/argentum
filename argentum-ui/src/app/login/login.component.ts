import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../common/rest-service/rest.service';
import {TokenResponse} from '../common/rest-service/response/token-response';
import {MessageComponent} from '../common/message/message.component';
import {Router} from '@angular/router';
import {LoginService} from '../common/rest-service/login.service';

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
      .subscribe((token: string) => {
        this.router.navigate(['/home']);
        this.waitingForLogin = false;
      }, (err: any) => {
        this.waitingForLogin = false;
        this.message.error(err);
      });
  }

}
