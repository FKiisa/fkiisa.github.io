
import { Component, OnInit } from '@angular/core';
import { User } from 'src/interfaces/user.interface';
import { ApiService } from '../services/api.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  listOpenState = false;
  constructor(private service: ApiService) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
    await this.service.getUsers().then(() => this.users = this.service.users);
    console.log(this.users);
  }
}
