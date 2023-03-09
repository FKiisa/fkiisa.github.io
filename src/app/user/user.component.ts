
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Album, Photo, User } from 'src/interfaces/user.interface';
import { AppService } from '../app.service';
import { SnackBarMessageService } from '../helpers/snackbar.helper';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userId: string;
  albumId: number;
  albumTitle: Album;
  userAlbums: Album[] = [];
  albumPhotos: Photo[] = [];
  albumListVisible = false;
  userDetails: User;
  images: Photo[] = [];
  addingNewAlbum: boolean = false;
  undo: boolean = false;
  addedAlbumCount: number = 0;
  removedAlbumCount: number = 0;
  removedAlbums: Album;

  albumForm = new FormGroup({
    albumTitle: new FormControl('', Validators.required),
  });
  constructor(private service: ApiService, private appService: AppService, private route: ActivatedRoute, public snackBar: SnackBarMessageService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.getUserDetails(parseInt(this.userId));
    this.getUserAlbums(parseInt(this.userId));
  }

  async getUserDetails(id: number) {
    await this.service.getUserDetails(id).then(() => this.userDetails = this.service.userDetails);
  }

  async getUserAlbums(id: number) {
    await this.service.getUserAlbums(id).then(() => this.userAlbums = this.service.albumData)
    console.log(this.userAlbums);
    this.formatAlbumTitles(this.userAlbums);
    this.albumListVisible = true;
  }
  async getAlbumPhotos(albumId: number) {
    await this.service.getAlbumContent(albumId).then(() => this.albumPhotos = this.service.photosData);
    await this.service.getAlbumTitle(albumId).then(() => this.albumTitle = this.service.albumTitle);
    this.albumId = albumId;
    console.log(this.albumPhotos);
    this.sendDataToService();
  }

  formatAlbumTitles = (albums: Album[]) => {
    this.userAlbums = albums.map(album => {
      return album.title.length >= 40 ? { ...album, title: album.title.slice(0, 40) + ".." } : album;
    });
  };

  handleRemoveAlbum = (albumId: number) => {
    this.undo = false;
    let snackBarRef = this.snackBar.snackBarSuccess(`Album: '${albumId}' deleted!`, 'Undo');
    this.userAlbums.forEach((album, idx) => {
      if (album.id === albumId) {
        this.removedAlbums = new Album(album.userId, album.id, album.title);
        this.userAlbums.splice(idx, 1);
      }
    });
    this.removedAlbumCount++;
      
    snackBarRef.onAction().subscribe(() => {
      this.undo = true;
      this.userAlbums.push(this.removedAlbums);
      this.userAlbums.sort((a, b) => a.id - b.id);
      this.snackBar.snackBarSuccess('Album restored', 'Ok');
      this.removedAlbumCount--;
    })
  }

  openNewImagePanel = () => {
    this.addingNewAlbum = !this.addingNewAlbum;
    this.albumForm.reset();
  }

  handleAddNewAlbum = () => {
    this.undo = false;
    let snackBarRef = this.snackBar.snackBarSuccess(`Album: '${this.userAlbums.length}' added!`, 'Undo');
    this.userAlbums.push(new Album(parseInt(this.userId), this.userAlbums.length, this.albumForm.value.albumTitle!));
    this.addedAlbumCount++;

    snackBarRef.onAction().subscribe(() => {
      this.undo = true;
      this.userAlbums.pop();
      this.addedAlbumCount--;
      this.snackBar.snackBarSuccess('Album removed', 'Ok');
    });
  }

  sendDataToService() {
    this.appService.setAlbumPhotos(this.albumPhotos);
    this.appService.setAlbumTitle(this.albumTitle);
    this.appService.setAlbumId(this.albumId);
  }
}
