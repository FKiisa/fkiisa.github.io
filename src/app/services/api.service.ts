import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Album, Photo, User } from 'src/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = "https://jsonplaceholder.typicode.com";
    users: User[] = [];
    albumData: Album[] = [];
    photosData: Photo[] = [];
    albumTitle: Album;
    userDetails: User

    constructor(private httpClient: HttpClient) { }
    getUsers() {
        const promise = new Promise<void>((resolve, reject) => {
            const apiURL = `${this.baseUrl}/users`;
            this.httpClient.get<User[]>(apiURL).subscribe({
                next: (res: any) => {
                    this.users = res.map((res: User) => {
                        return new User(res.id, res.name, res.username, res.email);
                    });
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {
                    console.log('complete');
                }
            })
        })
        return promise;
    }
    getUserDetails(userId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            const apiURL = `${this.baseUrl}/users/${userId}`;
            this.httpClient.get<User>(apiURL).subscribe({
                next: (res: any) => {
                    this.userDetails = new User(res.id, res.name, res.username, res.email);
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {
                    console.log('complete');
                },
            });
        });
        return promise;
    }

    getUserAlbums(userId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            const apiURL = `${this.baseUrl}/users/${userId}/albums`;
            this.httpClient.get<Album[]>(apiURL).subscribe({
                next: (res: any) => {
                    this.albumData = res.map((res: any) => {
                        return new Album(res.userId, res.id, res.title);
                    });
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {
                    console.log('complete');
                },
            });
        });
        return promise;
    }

    getAlbumContent(albumId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            const apiURL = `${this.baseUrl}/albums/${albumId}/photos`;
            this.httpClient.get<Photo[]>(apiURL).subscribe({
                next: (res: any) => {
                    this.photosData = res.map((res: any) => {
                        return new Photo(res.albumId, res.id, res.title, res.url, res.thumbnailUrl);
                    });
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {
                    console.log('complete');
                },
            });
        });
        return promise;
    }

    getAlbumTitle(albumId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            const apiURL = `${this.baseUrl}/albums/${albumId}`;
            this.httpClient.get<Album[]>(apiURL).subscribe({
                next: (res: any) => {
                    this.albumTitle = new Album(res.userId, res.id, res.title);
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
                complete: () => {
                    console.log('complete');
                },
            });
        });
        return promise;
    }
}