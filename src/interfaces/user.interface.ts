export class User {
  constructor(
    public id: number,
    public name: string,
    public username: string,
    public email: string,
    public address?: {
      street: string,
      suite: string,
      city: string,
      zipcode: string,
      geo: {
        lat: string,
        lng: string,
      }
    },
    public phone?: string,
    public website?: string,
    public company?: {
      name: string,
      catchPhrase: string,
      bs: string,
    },
    public albums?: Album[]
  ) { }
}

export class Album {
  constructor(
    public userId: number,
    public id: number,
    public title: string
  ) { }
}

export class Photo {
  constructor(
    public albumId: number,
    public id: number,
    public title: string,
    public url: string,
    public thumbnailUrl?: string,
  ) { }
}