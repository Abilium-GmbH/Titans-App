import { EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { filter } from 'rxjs/operators'; 

/**
 * This class can be used to merge promises and grab all errors
 * unlike Promise.all where you cannot add promises dynamically
 * in PromiseSoup you can simply add promises on the flight.
 * PromiseSoup works whenever you need e.g. to load data from different sources
 * in parallel but also conditionally, e.g.:
 * loadData1().then(v1 => {...})
 * if(something) {
 *  loadData2().then(v2 => {...})
 * }
 * // want to get notified (with errors) here when all promises have finished
 * 
 * WARNING: Be aware that this will only work if the promises take longer to execute than it takes for their initialization!
 * 
 * normal usage:
 * 
 * let soup = new PromiseSoup();
 * soup.add(loadData1).then(v1 => {...})
 * if(something) {
 *   soup.add(loadData2).then(v2 => {...})
 * }
 * soup.result().subscribe(state => {
 *   // state is updated for every promise resolved (might be used to indicate loading state)
 *   if(!state.busy) {
 *      // finished all tasks
 *      if(state.errors.length) {
 *          // has errors
 *      } else {
 *          / no errors
 *      }
 *   }
 * });
 * 
 */
export class PromiseSoup {

    busy: boolean = false;
    promises: Promise<any>[] = [];
    errors: any[] = [];
    observable: EventEmitter<{busy:boolean, errors:any[]}> = new EventEmitter();

    constructor() {
        
    }

    public add(promise: Promise<any>): Promise<any> {
        this.promises.push(promise);
        this.observable.next({
            busy: true,
            errors: this.errors
        });
        return new Promise((resolve, reject) => {
            promise.then(v => {
                resolve(v);
            }).catch(e => {
                this.errors.push(e);
                reject(e);
            }).finally(() => {
                this.remove(promise);
            });
        });
    }

    private remove(promise: Promise<any>): void {
        let idx = this.promises.findIndex(p => p==promise);
        if(idx>=0) {
            this.promises.splice(idx,1);
            if(!this.promises.length) {
                this.observable.next({
                    busy: false,
                    errors: this.errors
                });
            }
        }
    }

    public result(): Observable<{busy:boolean, errors:any[]}> {
        return this.observable;
    }

    public finished(): Promise<{busy:boolean, errors:any[]}> {
        return new Promise<{busy:boolean, errors:any[]}>((resolve, reject) => {
            this.observable.pipe(filter(a => !a.busy)).subscribe(v => {
                resolve(v);
            });
        });
        
    }
}