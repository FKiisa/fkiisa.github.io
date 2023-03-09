import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Album, Photo } from 'src/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private albumTitle = new BehaviorSubject<any>("")
  albumTitleObs = this.albumTitle.asObservable();

  private albumPhotos = new BehaviorSubject<Photo[]>([])
  albumPhotosObs = this.albumPhotos.asObservable();

  private albumId = new BehaviorSubject(0);
  albumIdObs = this.albumId.asObservable();

  setAlbumPhotos = (photos: Photo[]) => {
    this.albumPhotos.next(photos);
  }

  getAlbumPhotos = () => {
    return this.albumPhotos;
  }

  setAlbumTitle = (value: Album) => {
    this.albumTitle.next(value.title);
  }

  getAlbumTitle = () => {
    return this.albumTitle;
  }

  setAlbumId = (id: number) => {
    this.albumId.next(id);
  }

  getAlbumId = () => {
    return this.albumId;
  }
}
