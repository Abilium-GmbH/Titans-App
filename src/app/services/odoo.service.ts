import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class OdooService {
    private API_BASE_URL = `https://bernlacrosse.abilium.com`;
    private API_LOGIN_URL = `${this.API_BASE_URL}/web/session/authenticate`;
    private API_RESET_PASSWORD_URL = `${this.API_BASE_URL}/reset_password`;
    private API_GET_MY_EVENTS_URL = `${this.API_BASE_URL}/calendar/events/list/my`;
    private API_EVENT_ATTEND_URL = `${this.API_BASE_URL}/calendar/event/attend`;
    private API_EVENT_GET_URL = `${this.API_BASE_URL}/calendar/event/get`;
    private API_MODEL_CALL_URL = `${this.API_BASE_URL}/web/dataset/call_kw`;
    private API_UPDATE_PROFILE_URL = `${this.API_BASE_URL}/profile/update`;

    private STORE_USER_KEY = "STORE_USER_KEY";
    private STORE_SESSION_KEY = "STORE_SESSION_KEY";

    token: string;
    userdata: any;
    partner_id: any;

    constructor(public http: HttpClient, 
        private cookie: CookieService,
        private translate: TranslateService) {
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
            this.loadUserDataFromCookie();
            return true;
        }
        return false;
    }

    loadUserDataFromCookie() {
        let data = this.cookie.get(this.STORE_USER_KEY);
        if(data) {
            this.userdata = JSON.parse(data);
            if(this.userdata) {
                this.partner_id = this.userdata.partner_id;
                this.translate.use(this.userdata.user_context.lang.substring(0,2));
            }
            
        }
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
                this.userdata = data.body['result'];
                this.partner_id = this.userdata.partner_id;
                let expires = new Date(tokenString.split("; ")[1].split("=")[1]);
                this.cookie.set(this.STORE_SESSION_KEY, this.token, expires);
                this.cookie.set(this.STORE_USER_KEY, JSON.stringify(this.userdata), expires);
                this.translate.use(this.userdata.user_context.lang.substring(0,2));
                console.log(this.userdata.user_context.lang.substring(0,2))
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

    getEvent(eid: number) {
        return new Promise((resolve,reject) => {
            this.http.post(this.API_EVENT_GET_URL, {
                "jsonrpc": "2.0",
                "method": "call",
                "id": 1,
                "params": {
                  "eid": eid, 
                }}).toPromise().then(v => {
                resolve(v);
            });
        }); 
    }

    updateProfile(profileData: any) {
        return new Promise((resolve,reject) => {
            this.http.post(this.API_UPDATE_PROFILE_URL, {
                "jsonrpc": "2.0",
                "method": "call",
                "id": 1,
                "params": {
                  "partner": profileData, 
                }}).toPromise().then(v => {
                resolve(v);
            });
        }); 
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

    setData(model: string, values: {}, id: number) {
        return new Promise<any>((resolve, reject) => {
            this.http.post(this.API_MODEL_CALL_URL, {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "model": model,
                "method": "write",
                "args": [
                    id, values
                ],
                "kwargs": {
                 }
            }
            }).toPromise().then(res => {
                if(res['result']) {
                    resolve(res['result']);
                } else {
                    reject("no data");
                }
            })
        });
    }

    getData(model: string, fields: {}, id: number) {
        return new Promise<any>((resolve, reject) => {
            this.http.post(this.API_MODEL_CALL_URL, {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "model": model,
                "method": "read",
                "args": [
                    id, Object.keys(fields)
                ],
                "kwargs": {
                 }
            }
            }).toPromise().then(res => {
                if(res['result']) {
                    resolve(res['result']);
                } else {
                    reject("no data");
                }
            })
        });
    }

    getAll(model: string, fields: {}) {
        return new Promise<any>((resolve, reject) => {
            this.http.post(this.API_MODEL_CALL_URL, {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "model": model,
                "method": "search_read",
                "args": [
                ],
                "kwargs": {
                    "fields": Object.keys(fields),
                 }
            }
            }).toPromise().then(res => {
                if(res['result']) {
                    resolve(res['result']);
                } else {
                    reject("no data");
                }
            })
        });
    }

    adm(model, field, value) {
        if(model.fields_display_mapper && field in model.fields_display_mapper) {
            return model.fields_display_mapper[field](value);
        }
        return value;
    }
}