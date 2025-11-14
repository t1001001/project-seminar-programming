import { Component } from '@angular/core';
import { HomeDashboardComponent } from 'home-lib';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeDashboardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
