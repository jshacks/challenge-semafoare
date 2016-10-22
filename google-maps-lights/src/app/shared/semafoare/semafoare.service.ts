import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
const API = 'http://' + window.location.host + ':3000';

@Injectable()
export class SemafoareService {
  constructor(private http:Http) {

  }

  compileSteps(stepList) {
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

  getSemafoare(stepList) {
    const compiledSteps = this.compileSteps(stepList);
    console.log('compiledSteps', compiledSteps);
    return new Promise((resolve, reject) => {
      this.http.post(`${API}/get-semafoare`, compiledSteps).subscribe((res) => {
        resolve(res.json());
      }, reject);
    })
  }
}
