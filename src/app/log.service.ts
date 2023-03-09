import { Injectable } from '@angular/core';
import { LogAction } from 'src/interfaces/log.interface';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  logs: string[] = [];
  constructor() { }

  addLog = (userId: number, albumId: number, action: LogAction, imageId?: number) => {
    imageId ? this.logs.push(`User ${userId} ${action} ${imageId} for album ${albumId}`) : this.logs.push(`User ${userId} ${action} ${albumId}`);
    console.log(this.logs);
  }

  getLogs = () => this.logs;
}
