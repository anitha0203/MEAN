import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false
  private authListener!: Subscription

  constructor(private service: AuthService){}

  ngOnInit(){
    this.userIsAuthenticated = this.service.getIsAuth()
      this.authListener = this.service.getAuthStatus().subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated
      })
  }

  onLogout(){
    this.service.logout()
  }

  ngOnDestroy(){
      this.authListener.unsubscribe()
  }

}
