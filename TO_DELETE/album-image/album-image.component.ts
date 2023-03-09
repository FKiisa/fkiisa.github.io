import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/interfaces/user.interface';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog'; 
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-album-image',
  templateUrl: './album-image.component.html',
  styleUrls: ['./album-image.component.css']
})
export class AlbumImageComponent implements OnInit {
  albumPhotos: Photo[] = [];
  albumTitle: string;
  albumId: number;
  addingNewGame: boolean = false;

  constructor(private appService: AppService, public dialog: MatDialog) { }

  ngOnInit() {
    this.appService.albumPhotosObs.subscribe(data => {
      this.albumPhotos = data;
    });
    this.appService.albumTitleObs.subscribe(data => {
      this.albumTitle = data;
    })
    this.appService.albumIdObs.subscribe(data => {
      this.albumId = data;
    })
  }

  handleImageDelete = (image: Photo) => {
    this.albumPhotos.forEach((el, idx) => {
      if (el.id === image.id) this.albumPhotos.splice(idx, 1);
    });
  }

  handleImageAdd = () => {
    console.log("added");
    this.addingNewGame = true;
  }

  handleSubmitImage = () => {
    console.log("submitted");
  }

}