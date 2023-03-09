import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LogAction } from 'src/interfaces/log.interface';
import { Album, Photo, User } from 'src/interfaces/user.interface';
import { AlbumService } from '../services/album.service';
import { SnackBarMessageService } from '../helpers/snackbar.helper';
import { LogService } from '../services/log.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userId: number;
  albumId: number;
  albumTitle: Album;
  albumPhotos: Photo[] = [];
  userAlbums: Album[] = [];
  userDetails: User;
  removedAlbum: Album;
  undo: boolean = false;
  albumListVisible = false;
  addedAlbumCount: number = 0;
  removedAlbumCount: number = 0;
  addingNewAlbum: boolean = false;
  albumForm = new FormGroup({
    albumTitle: new FormControl('', Validators.required),
  });

  constructor(private service: ApiService, private albumService: AlbumService, private route: ActivatedRoute, public snackBar: SnackBarMessageService, private logService: LogService) { }

  ngOnInit() {
    this.userId = parseInt(this.route.snapshot.paramMap.get('userId')!);
    this.getUserDetails(this.userId);
    this.getUserAlbums(this.userId);
  }
  /**
   * @param userId - Used for sending a request to getting the user details from API
   */
  async getUserDetails(userId: number) {
    await this.service.getUserDetails(userId).then(() => this.userDetails = this.service.userDetails);
  }

  /**
   * @param userId - Used for sending a request to getting the albums available for the user from API
   */
  async getUserAlbums(userId: number) {
    await this.service.getUserAlbums(userId).then(() => this.userAlbums = this.service.albumData)
    this.formatAlbumTitles(this.userAlbums);
    this.albumListVisible = true;
  }

  /**
   * @param albumId - Used for sending a request to getting the photos available in this album from API
   */
  async getAlbumPhotos(albumId: number) {
    await this.service.getAlbumContent(albumId).then(() => this.albumPhotos = this.service.photosData);
    await this.service.getAlbumTitle(albumId).then(() => this.albumTitle = this.service.albumTitle);
    this.albumId = albumId;
    this.sendDataToService();
  }

  /**
   * @param albums Get a list of albums and return with their titles modified, used to reduce word wrapping issues
   */
  formatAlbumTitles = (albums: Album[]) => {
    this.userAlbums = albums.map(album => {
      return album.title.length >= 40 ? { ...album, title: album.title.slice(0, 40) + ".." } : album;
    });
  };

  /**
   * Toggles the visibility of new album panel and reset the form
   */
  openNewAlbumPanel = () => {
    this.addingNewAlbum = !this.addingNewAlbum;
    this.albumForm.reset();
  }

  /**
   * @param albumId - Used for removing albums from the userAlbums array.
   * Method also supports take-back (undo) in case the user has accidentally deleted it.
   */
  handleRemoveAlbum = (albumId: number) => {
    this.undo = false;
    this.removedAlbumCount++;
    this.userAlbums.forEach((album, idx) => {
      if (album.id === albumId) {
        this.removedAlbum = new Album(album.userId, album.id, album.title);
        this.userAlbums.splice(idx, 1);
      }
    });
    this.logService.addLog(this.userId, albumId, LogAction.RemoveAlbum);
    let snackBarRef = this.snackBar.snackBarSuccess(`Album: '${albumId}' deleted!`, 'Undo');

    snackBarRef.onAction().subscribe(() => {
      this.undo = true;
      this.removedAlbumCount--;
      this.userAlbums.push(this.removedAlbum);
      this.userAlbums.sort((a, b) => a.id - b.id);
      this.snackBar.snackBarSuccess('Album restored');
      this.logService.addLog(this.userId, albumId, LogAction.UndoAlbum);
    })
  }

  /**
   * Method used for adding albums to the userAlbums array.
   * Method also supports take-back (undo) in case the user has accidentally added a new album.
   */
  handleAddNewAlbum = () => {
    this.undo = false;
    this.addedAlbumCount++;
    let newAlbumId = this.userAlbums[this.userAlbums.length - 1].id + 1;
    let snackBarRef = this.snackBar.snackBarSuccess(`Album: '${newAlbumId}' added!`, 'Undo');
    this.userAlbums.push(new Album(this.userId, newAlbumId, this.albumForm.value.albumTitle!));
    this.logService.addLog(this.userId, newAlbumId, LogAction.AddAlbum);

    snackBarRef.onAction().subscribe(() => {
      this.logService.addLog(this.userId, newAlbumId, LogAction.UndoAlbum);
      this.undo = true;
      this.userAlbums.pop();
      this.addedAlbumCount--;
      this.snackBar.snackBarSuccess('Album removed');
    });
  }

  /**
   * Send data to albumService to use in case of a refresh
   */
  sendDataToService() {
    this.albumService.setAlbumPhotos(this.albumPhotos);
    this.albumService.setAlbumTitle(this.albumTitle);
    this.albumService.setAlbumId(this.albumId);
  }
}
