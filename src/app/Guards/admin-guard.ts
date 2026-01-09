import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<any>('https://pharmacy-8ea3f-default-rtdb.firebaseio.com/auth.json').pipe(
    map((check) => {
      if (check.loggedIn === true && check.role === 'admin') {
        return true;
      } else {
        router.navigateByUrl('/signin');
        return false;
      }
    })
  );
};
