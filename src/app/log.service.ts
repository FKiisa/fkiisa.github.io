import { Injectable } from '@angular/core';
import { LogAction } from 'src/interfaces/log.interface';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  logs: string[] = [];
  constructor() { }
  /**
   * 
   * @param userId user id, used to determine the user
   * @param albumId album id, used to determine the album
   * @param action action, used to determine that action the user did
   * @param imageId image id, if available, determines if user is actioning on albums or images
   */
  addLog = (userId: number, albumId: number, action: LogAction, imageId?: number) => {
    imageId ? this.logs.push(`User ${userId} ${action} ${imageId} for album ${albumId}`) : this.logs.push(`User ${userId} ${action} ${albumId}`);
    console.log(this.logs);
  }
  /**
   * Returns all entries in the logs array
   */
  getLogs = () => this.logs;
}
