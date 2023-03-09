import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarMessageService {
    constructor(public snackBar: MatSnackBar) { }
    defaultDuration: number = 300000;
    snackBarSuccess(message: string, action: string = "Ok") {
        return this.snackBar.open(message, action, this.configSuccess);
    }
    snackBarFailed(message: string, action: string = "Ok") {
        return this.snackBar.open(message, action, this.configError);
    }
    public configSuccess: MatSnackBarConfig = {
        duration: this.defaultDuration,
        panelClass: ['green-snackbar'],
    };

    public configError: MatSnackBarConfig = {
        duration: this.defaultDuration,
        panelClass: ['red-snackbar'],
    };
}