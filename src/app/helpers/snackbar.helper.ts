import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarMessageService {
    constructor(public snackBar: MatSnackBar) { }
    defaultDuration: number = 3000;

    /**
     * @param message string value to display in the snackbar
     * @param action string value to display as the action button value
     * @returns a successful snackbar component with message as the text and action as the button value
     */
    snackBarSuccess(message: string, action: string = "Ok") {
        return this.snackBar.open(message, action, this.configSuccess);
    }
    /**
     * @param message string value to display in the snackbar
     * @param action string value to display as the action button value
     * @returns a failed snackbar component with message as the text and action as the button value
     */
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