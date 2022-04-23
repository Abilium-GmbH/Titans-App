import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class OdooService {
    private API_BASE_URL = `https://bernlacrosse.abilium.com`;
    private API_LOGIN_URL = `${this.API_BASE_URL}/web/session/authenticate`;
    private API_RESET_PASSWORD_URL = `${this.API_BASE_URL}/reset_password`;
    private API_GET_MY_EVENTS_URL = `${this.API_BASE_URL}/calendar/events/list/my`;
    private API_EVENT_ATTEND_URL = `${this.API_BASE_URL}/calendar/event/attend`;

    private STORE_USER_KEY = "STORE_USER_KEY";
    private STORE_SESSION_KEY = "STORE_SESSION_KEY";

    token: string;
    userdata: any;

    constructor(public http: HttpClient, private cookie: CookieService) {
    }

    createHeader(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json'});
    }

    createAuthHeader(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token});
    }

    checkTokenAvailableAndNotExpired() {
        let ck = this.cookie.get(this.STORE_SESSION_KEY);
        if(ck) {
            this.token = ck;
            return true;
        }
        return false;
    }

    login(email: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.post(this.API_LOGIN_URL, {
                "jsonrpc": "2.0",
                "method": "call",
                "id": 1,
                "params": {
                  "db": "bernlacrosse",
                  "login": email, 
                  "password": password
                }
              }, {observe: 'response', withCredentials: true}).toPromise().then(data => {
                let tokenString = data.headers.getAll("X-Token")[0];
                this.token = tokenString.split("; ")[0].split("=")[1];
                this.userdata = data;
                let expires = new Date(tokenString.split("; ")[1].split("=")[1]);
                this.cookie.set(this.STORE_SESSION_KEY, this.token, expires);
                this.cookie.set(this.STORE_USER_KEY, JSON.stringify(this.userdata), expires);
                resolve(true);
            }).catch(e => {
                console.log("failed logging in", e);
                reject(e);
            })
        });
    }

    resetPassword(email: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.post(this.API_RESET_PASSWORD_URL, {
                "jsonrpc": "2.0",
                "method": "call",
                "id": 1,
                "params": {
                  "login": email, 
                }
              }).toPromise().then(data => {
                  if(!('error' in data)) {
                    resolve(true);
                  } else {
                      reject("not found");
                  }
                
            }).catch(e => {
                console.log("failed logging in", e);
                reject(e);
            })
        });
    }

    logout() {
        this.cookie.delete(this.STORE_SESSION_KEY);
        this.cookie.delete(this.STORE_USER_KEY);
        this.token = null;
        this.userdata = null;
    }

    getMyEvents() {
        return this.http.post(this.API_GET_MY_EVENTS_URL, {}).toPromise();
    }

    setParticipation(eid: number, answer: string) {
        return new Promise((resolve,reject) => {
            this.http.post(this.API_EVENT_ATTEND_URL, {
                "jsonrpc": "2.0",
                "method": "call",
                "id": 1,
                "params": {
                  "eid": eid, 
                  "answer": answer
                }}).toPromise().then(v => {
                resolve(v);
            });
        });
        
    }

}