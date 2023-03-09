import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Album, Photo } from 'src/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private albumTitle = new BehaviorSubject<any>("")
  albumTitleObs = this.albumTitle.asObservable();

  private albumPhotos = new BehaviorSubject<Photo[]>([])
  albumPhotosObs = this.albumPhotos.asObservable();

  private albumId = new BehaviorSubject(0);
  albumIdObs = this.albumId.asObservable();

  /**
   * @param photos Set photos to array, mostly used in case of refresh scenario
   */
  setAlbumPhotos = (photos: Photo[]) => {
    this.albumPhotos.next(photos);
  }
  /**
   * @returns Get album photos
   */
  getAlbumPhotos = () => {
    return this.albumPhotos;
  }
  /**
   * @param value Set title of the album, mostly used in case of refresh scenario
   */
  setAlbumTitle = (value: Album) => {
    this.albumTitle.next(value.title);
  }
  /**
   * @returns Get title of the album
   */
  getAlbumTitle = () => {
    return this.albumTitle;
  }

  /**
   * @param id Set album ID, mostly used in case of refresh scenario
   */
  setAlbumId = (id: number) => {
    this.albumId.next(id);
  }
  /**
   * @returns Get Album ID
   */
  getAlbumId = () => {
    return this.albumId;
  }
}
