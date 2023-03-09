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
    /**
     * @returns A promise, for all users from /users endpoint
     */
    getUsers() {
        const promise = new Promise<void>((resolve, reject) => {
            this.httpClient.get<User[]>(`${this.baseUrl}/users`).subscribe({
                next: (res) => {
                    this.users = res.map((res) => {
                        return new User(res.id, res.name, res.username, res.email);
                    });
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
            })
        })
        return promise;
    }
    /**
     * @param userId User id, used to get details for this user by /users/:userId endpoint
     * @returns A promise, for User class with id, name, username and email
     */
    getUserDetails(userId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            this.httpClient.get<User>(`${this.baseUrl}/users/${userId}`).subscribe({
                next: (res) => {
                    this.userDetails = new User(res.id, res.name, res.username, res.email);
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
            });
        });
        return promise;
    }
    /**
     * @param userId User id, used to get albums available for this user by /users/:userId/albums endpoint
     * @returns A promise, for all albums available to this user as an Album class
     */
    getUserAlbums(userId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            this.httpClient.get<Album[]>(`${this.baseUrl}/users/${userId}/albums`).subscribe({
                next: (res) => {
                    this.albumData = res.map((res) => {
                        return new Album(res.userId, res.id, res.title);
                    });
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
            });
        });
        return promise;
    }
    /**
     * @param albumId Album id, used to get content for that specific album using albums/:albumdId/photos endpoint
     * @returns A promise, for all images available for this album as a Photo class
     */
    getAlbumContent(albumId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            this.httpClient.get<Photo[]>(`${this.baseUrl}/albums/${albumId}/photos`).subscribe({
                next: (res) => {
                    this.photosData = res.map((res) => {
                        return new Photo(res.albumId, res.id, res.title, res.url, res.thumbnailUrl);
                    });
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
            });
        });
        return promise;
    }
    /**
     * 
     * @param albumId Album id, used to get the title of this specific album using albums/:albumId endpoint
     * @returns A promise for a new Album class with userId, album id and album title
     */
    getAlbumTitle(albumId: number) {
        const promise = new Promise<void>((resolve, reject) => {
            this.httpClient.get<Album[]>(`${this.baseUrl}/albums/${albumId}`).subscribe({
                next: (res: any) => {
                    this.albumTitle = new Album(res.userId, res.id, res.title);
                    resolve();
                },
                error: (err: any) => {
                    reject(err);
                },
            });
        });
        return promise;
    }
}