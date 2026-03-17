import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarModal } from '../../shared/snackbar-modal/snackbar-modal';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  //#region properties
  // private readonly messageService = inject(ToastrService);
  private _snackBar = inject(MatSnackBar);

  //#endregion

  //#region constructor
  public constructor() {
  }
  //#endregion

  //#region public methods
  /**
   * A method to show success notification
   * @param summary summary of the notification
   * @param message message of the notification
   */
  public showSuccess(summary: string, message: string) {
    this._snackBar.openFromComponent(SnackbarModal, { data: { message, type: 'success', title: summary }, duration: 3000 });
  }

  /**
   * A method to show error notification
   * @param summary summary of the notification
   * @param message message of the notification
   */
  public showError(summary: string, message: string) {
    this._snackBar.openFromComponent(SnackbarModal, { data: { message, type: 'error', title: summary }, duration: 3000 });
  }

  /**
   * A method to show warning notification
   * @param summary summary of the notification
   * @param message message of the notification
   */
  public showWarning(summary: string, message: string) {
    this._snackBar.openFromComponent(SnackbarModal, { data: { message, type: 'warning', title: summary }, duration: 3000 });
  }

  /**
   * A method to show info notification
   * @param summary summary of the notification
   * @param message message of the notification
   */
  public showInfo(summary: string, message: string) {
    this._snackBar.openFromComponent(SnackbarModal, { data: { message, type: 'info', title: summary }, duration: 3000 });
  }
  //#endregion
}
