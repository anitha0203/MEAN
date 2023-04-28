import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class AuthService {
    private userIsAuthenticated = false
    private token!: string
    private tokenTimer!: NodeJS.Timer
    private authStatus = new Subject<boolean>()
    private userId:  any

    constructor(private http: HttpClient, private route: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.userIsAuthenticated;
    }

    getUserId(){
        return this.userId
    }

    getAuthStatus(){
        return this.authStatus.asObservable();
    }

    createUser(email: string,password: string){
        const authData: AuthData = {email: email, password:password}
        return this.http.post('http://localhost:3000/api/signup',authData).subscribe(res => {
            this.route.navigate([""])
        }, error => {
            this.authStatus.next(false)
        })
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password:password}
        this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/login', authData)
        .subscribe(res => {
            const token = res.token
            this.token = token
            if(token){
                const expiresInDuration = res.expiresIn
                this.setAuthTimer(expiresInDuration)
                this.userIsAuthenticated = true
                this.userId = res.userId
                this.authStatus.next(true)
                const date = new Date()
                const eDate = new Date(date.getTime() + expiresInDuration * 1000)                
                this.saveAuthData(token,eDate, this.userId)
                this.route.navigate([''])
            }

        }, error => {
            this.authStatus.next(false)
        })
    }

    autoAuthUser(){
        const authInformation = this.getAuthData()
        if(authInformation){
            const now = new Date()
            const isInFuture = authInformation.expiresDate.getTime() - now.getTime()
            console.log(authInformation, isInFuture);
            
            if(isInFuture > 0){
                this.token = authInformation.token
                this.userIsAuthenticated = true
                this.userId = authInformation.userId
                this.setAuthTimer(isInFuture / 1000)
                this.authStatus.next(true)
            }
        }
    }

    logout(){
        this.token = ''
        this.userIsAuthenticated = false
        this.authStatus.next(false)
        this.userId = ''
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
        this.route.navigate([''])
    }

    private setAuthTimer(duration: number){
        console.log(duration);
        
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("Token", token)
        localStorage.setItem("Expiration", expirationDate.toISOString())
        localStorage.setItem("UserId", userId)
    }

    private clearAuthData(){
        localStorage.removeItem("Token")
        localStorage.removeItem("Expiration")
        localStorage.removeItem("UserId")
    }

    private getAuthData(){
        const token = localStorage.getItem("Token")
        const expiresdate = localStorage.getItem("Expiration")
        const UserId = localStorage.getItem("UserId")
        if(!token || !expiresdate || !this.userId){
            return
        }
        return {
            token:token,
            expiresDate: new Date(expiresdate),
            userId:UserId
        }
    }
}