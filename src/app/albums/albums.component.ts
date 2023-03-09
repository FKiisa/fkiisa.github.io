import { Component, OnInit } from '@angular/core';
import { Album, Photo } from 'src/interfaces/user.interface';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SnackBarMessageService } from '../helpers/snackbar.helper';
import { LogService } from '../log.service';
import { LogAction } from 'src/interfaces/log.interface';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
  albumPhotos: Photo[] = [];
  albumTitle: Album;
  albumId: number;
  userId: number;
  addingNewImage: boolean = false;
  undo: boolean = false;
  removedImage: Photo;
  imageForm = new FormGroup({
    imageTitle: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });

  constructor(private service: ApiService, private appService: AppService, public dialog: MatDialog, private route: ActivatedRoute, public snackBar: SnackBarMessageService, private logService: LogService) { }

  ngOnInit() {
    this.albumId = parseInt(this.route.snapshot.paramMap.get('albumId')!);
    this.userId = parseInt(this.route.snapshot.paramMap.get('userId')!);
    this.getAlbumImages(this.albumId);
    this.appService.albumPhotosObs.subscribe(data => {
      this.albumPhotos = data;
    });
    this.appService.albumTitleObs.subscribe(data => {
      this.albumTitle = data;
    })
  }

  async getAlbumImages(albumId: number) {
    await this.service.getAlbumContent(albumId).then(() => this.albumPhotos = this.service.photosData);
    await this.service.getAlbumTitle(albumId).then(() => this.albumTitle = this.service.albumTitle);
    this.sendDataToService();
  }

  sendDataToService() {
    this.appService.setAlbumPhotos(this.albumPhotos);
    this.appService.setAlbumTitle(this.albumTitle);
    this.appService.setAlbumId(this.albumId);
  }

  handleImageDelete = (image: Photo) => {
    this.undo = false;
    let snackBarRef = this.snackBar.snackBarSuccess(`Image: '${image.id} - ${image.title}' deleted!`, 'Undo');
    if (!this.undo) {
      this.albumPhotos.forEach((el, idx) => {
        if (el.id === image.id) {
          this.removedImage = new Photo(el.albumId, el.id, el.title, el.url);
          this.albumPhotos.splice(idx, 1);
          this.logService.addLog(this.userId, this.albumId, LogAction.RemoveImage, this.removedImage.id);
        }
      });
    }
    snackBarRef.onAction().subscribe(() => {
      this.undo = true;
      this.albumPhotos.push(new Photo(this.removedImage.albumId, this.removedImage.id, this.removedImage.title, this.removedImage.url));
      this.logService.addLog(this.userId, this.albumId, LogAction.UndoImage, this.removedImage.id);
      this.albumPhotos.sort((a, b) => a.id - b.id);
      this.snackBar.snackBarSuccess('Image restored', 'Ok');
    })
  }

  openNewImagePanel = () => {
    this.addingNewImage = !this.addingNewImage;
    this.imageForm.reset();
  }

  handleAddNewImage = () => {
    this.undo = false;
    let newPhotoId = this.albumPhotos[this.albumPhotos.length - 1].id + 1;
    let snackBarRef = this.snackBar.snackBarSuccess(`Image: '${newPhotoId} - ${this.imageForm.value.imageTitle}' added!`, 'Undo')
    this.albumPhotos.push(new Photo(this.albumId, newPhotoId, this.imageForm.value.imageTitle!, this.imageForm.value.imageUrl!));
    this.logService.addLog(this.userId, this.albumId, LogAction.AddImage, newPhotoId);

    snackBarRef.onAction().subscribe(() => {
      this.undo = true;
      this.albumPhotos.pop();
      this.snackBar.snackBarSuccess('Image removed', 'Ok');
      this.logService.addLog(this.userId, this.albumId, LogAction.UndoImage, newPhotoId);
    });
  }
}
