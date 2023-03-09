import { Component, OnInit } from '@angular/core';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  activityLog: string[] = [];

  constructor(private logService: LogService) { }
  ngOnInit(): void {
    this.activityLog = this.logService.getLogs();
  }
}
