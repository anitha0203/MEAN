import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false
    private authStatusSub!: Subscription
    
    constructor(private service: AuthService){}

    
  ngOnInit(): void {
    this.authStatusSub = this.service.getAuthStatus().subscribe(
     authStatus => {
       this.isLoading = false
     }
    )
 }

    onLogin(form: NgForm){
        if(form.invalid)
            return
        this.isLoading = true
        this.service.login(form.value.email,form.value.password)
    }

    
    ngOnDestroy(){
      this.authStatusSub.unsubscribe()
    }
}
