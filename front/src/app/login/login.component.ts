import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {TokenStorageService} from "../services/token-storage.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  pseudo:any = "";
  password:any = "";
  isConnected = false;
  subscription!: Subscription;

  constructor(public authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isConnected = true;
    }

    this.subscription = this.authService.connectedSource.subscribe(isConnected => this.isConnected = isConnected);
  }

  handleLogIn():void{
    let user = {
      pseudo: this.pseudo,
      password: this.password
    }
    this.authService.logIn(user).subscribe(
          (info:any) => {
            this.tokenStorage.saveToken(info.accessToken);
            this.tokenStorage.saveUser(info);
            this.newConnection();
            this.router.navigate(['/profile'])
          }, (error: any) => {
            console.log("error log in:", error);
          });
  }

  newConnection() {
      this.authService.changeConnectionStatus(true)
  }

}
