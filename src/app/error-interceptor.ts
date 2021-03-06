import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialogue: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An Unknown error occured';
                if (error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialogue.open(ErrorComponent, {data: { message: errorMessage}});
                console.log(error.error.message);
                return throwError(error);
            })
        );
    }
}
