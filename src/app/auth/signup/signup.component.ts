import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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

    signup(form: NgForm){
        if(form.invalid)
          return
          this.isLoading = true
        this.service.createUser(form.value.email,form.value.password)
        // .subscribe(null, error => {
        //     this.isLoading = false
        // })
    }

    ngOnDestroy(){
      this.authStatusSub.unsubscribe()
    }
}
