import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarOpen = false;
  
  // Toggle sidebar for mobile view
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  // Close sidebar when clicking a link on mobile
  closeSidebarOnMobile(): void {
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }
  
  // Close sidebar when window is resized to desktop size
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth >= 768) {
      this.isSidebarOpen = false;
    }
  }
}
