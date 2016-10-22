import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
const API = 'http://localhost:3000';

@Injectable()
export class SemafoareService {
  constructor(private http: Http) {

  }

  compileSteps(stepList){
    return stepList.map((step) => {
      
      return {
        start_location: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng(),
        },
        end_location: {
          lat: step.end_location.lat(),
          lng: step.end_location.lng(),
        }
      }
    })
  }
  getSemafoare(stepList){
    const compiledSteps =  this.compileSteps(stepList);
    console.log('compiledSteps',compiledSteps);
    return this.http.post(`${API}/get-semafoare`,compiledSteps)
  }
}