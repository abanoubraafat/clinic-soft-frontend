import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (localStorage.getItem("user") == "admin" || localStorage.getItem("user") == "R") {
    return true;
  } else {
    router.navigateByUrl('/Login');
    return false;
  }
};
