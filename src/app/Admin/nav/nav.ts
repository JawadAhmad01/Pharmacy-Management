import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Logout } from '../../Services/logout';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected isSidebarOpen = false;
  protected logoutService = inject(Logout);
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebarOnMobile() {
    if (window.innerWidth < 700) {
      this.isSidebarOpen = false;
    }
  }
}
