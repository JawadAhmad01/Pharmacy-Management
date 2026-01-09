import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Logout {
  private http = inject(HttpClient);
  private router = inject(Router);

  logOut() {
    this.http
      .put('https://pharmacy-8ea3f-default-rtdb.firebaseio.com/auth.json', {
        loggedIn: false,
        role: '',
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.log;
        },
      });
  }
}
