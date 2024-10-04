import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private apiUrl = 'http://localhost:4200/api';  

  constructor(private http: HttpClient) {}

  syncData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sync`);
  }

  getMachines(): Observable<any> {
    return this.http.get(`${this.apiUrl}/machine`);
  }

  getMachineById(machineId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/machine/${machineId}`);
  }

  getProductions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/production`);
  }

  getProductionById(productionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/${productionId}`);
  }

  getProductionByMachineId(machineId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/production/machine/${machineId}`);
  }
}