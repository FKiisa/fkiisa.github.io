import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Album, Photo } from 'src/interfaces/user.interface';
import { AppService } from '../app.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.css']
})
export class ContentAreaComponent implements OnInit {
  userAlbums: any[] = [];
  userArray: any;
  events: string[] = [];
  albumPhotos: Photo[] = [];
  opened: boolean = true;
  listOpenState = false;
  albumListState = false;
  albumTitle: Album;
  albumId: number;
  constructor(private service: ApiService, private appService: AppService) { }

  ngOnInit() {
    this.service.getUsers()
      .subscribe(res => {
        this.userArray = res;
      });
  }

  async getUserAlbums(id: number) {
    await this.service.getUserAlbums(id).then(() => this.userAlbums = this.service.albumData)
    console.log(this.userAlbums);
    this.albumListState = true;
  }

  async getAlbumPhotos(albumId: number) {
    await this.service.getAlbumContent(albumId).then(() => this.albumPhotos = this.service.photosData);
    await this.service.getAlbumTitle(albumId).then(() => this.albumTitle = this.service.albumTitle);
    this.albumId = albumId;
    console.log(this.albumPhotos);
    this.sendDataToService();
  }

  sendDataToService() {
    this.appService.setAlbumPhotos(this.albumPhotos);
    this.appService.setAlbumTitle(this.albumTitle);
    this.appService.setAlbumId(this.albumId);
  }
}
