import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (localStorage.getItem("user") == "admin") {
    return true;
  } else {
    router.navigateByUrl('/home');
    return false;
  }
};
