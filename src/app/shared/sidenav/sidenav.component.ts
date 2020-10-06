import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { AuthGuard } from 'src/app/auth/auth.guard';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  sidenav: string;
  name: string;
  constructor(
    private router: Router,
    private Session: SessionStorageService,
    private authService: AuthGuard
  ) { }

  ngOnInit(): void {
    const str = this.Session.retrieve('user');
    if ((this.Session.retrieve('user'))) {
      const array = str.split(',');
      this.name = array[0];
    }
  }
  toggle() {
    this.sidenav = this.sidenav ? '' : 'open';
  }
  Logout() {
    this.authService.logoutUser();
    this.name = null;
  }
}
