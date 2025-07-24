import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from 'src/app/components/navbar/navbar';

@Component({
  selector: 'app-todos',
  imports: [Navbar, CommonModule],
  templateUrl: './todos.html',
})
export class Todos {}
