// components/news-management/news-management.component.ts
import { Component, OnInit } from '@angular/core';
import { News, CreateNewsRequest, UpdateNewsRequest } from '../../models/news.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-management',
  standalone: false,
  templateUrl: './news-management.component.html',
  styleUrl: './news-management.component.css'
})
export class NewsManagementComponent implements OnInit {
  news: News[] = [];
  filteredNews: News[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  
  // Modal states
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showViewModal = false;
  
  // Form data
  newsForm: CreateNewsRequest = {
    title: '',
    content: '',
    imageUrl: ''
  };
  
  editForm: UpdateNewsRequest = {
    title: '',
    content: '',
    imageUrl: ''
  };
  
  selectedNews: News | null = null;
  formSubmitting = false;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.fetchNews();
  }

  fetchNews(): void {
    this.loading = true;
    this.error = '';
    this.newsService.getAllNews()
      .subscribe({
        next: (data: News[]) => {
          this.news = data.sort((a, b) => 
            new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime()
          );
          this.filteredNews = [...this.news];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load news: ' + (err.message || 'Unknown error');
          this.loading = false;
          console.error('Error fetching news:', err);
        }
      });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredNews = [...this.news];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredNews = this.news.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.content.toLowerCase().includes(searchLower) ||
      item.id?.toString().includes(searchLower)
    );
  }

  // Image error handler
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://via.placeholder.com/80x60?text=No+Image';
    }
  }

  // Modal methods
  openAddModal(): void {
    this.newsForm = {
      title: '',
      content: '',
      imageUrl: ''
    };
    this.showAddModal = true;
  }

  openEditModal(newsItem: News): void {
    this.selectedNews = newsItem;
    this.editForm = {
      title: newsItem.title,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl
    };
    this.showEditModal = true;
  }

  openDeleteModal(newsItem: News): void {
    this.selectedNews = newsItem;
    this.showDeleteModal = true;
  }

  openViewModal(newsItem: News): void {
    this.selectedNews = newsItem;
    this.showViewModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showViewModal = false;
    this.selectedNews = null;
    this.formSubmitting = false;
  }

  // CRUD operations
  addNews(): void {
    if (!this.isFormValid(this.newsForm)) {
      return;
    }

    this.formSubmitting = true;
    this.newsService.createNews(this.newsForm)
      .subscribe({
        next: (newNews) => {
          this.news.unshift(newNews);
          this.filteredNews = [...this.news];
          this.closeModals();
          this.showSuccessMessage('News added successfully!');
        },
        error: (err) => {
          this.error = 'Failed to add news: ' + (err.message || 'Unknown error');
          this.formSubmitting = false;
        }
      });
  }

  updateNews(): void {
    if (!this.selectedNews || !this.isFormValid(this.editForm)) {
      return;
    }

    this.formSubmitting = true;
    this.newsService.updateNews(this.selectedNews.id!, this.editForm)
      .subscribe({
        next: (updatedNews) => {
          const index = this.news.findIndex(item => item.id === this.selectedNews!.id);
          if (index !== -1) {
            this.news[index] = updatedNews;
            this.filteredNews = [...this.news];
          }
          this.closeModals();
          this.showSuccessMessage('News updated successfully!');
        },
        error: (err) => {
          this.error = 'Failed to update news: ' + (err.message || 'Unknown error');
          this.formSubmitting = false;
        }
      });
  }

  deleteNews(): void {
    if (!this.selectedNews) {
      return;
    }

    this.formSubmitting = true;
    this.newsService.deleteNews(this.selectedNews.id!)
      .subscribe({
        next: () => {
          this.news = this.news.filter(item => item.id !== this.selectedNews!.id);
          this.filteredNews = [...this.news];
          this.closeModals();
          this.showSuccessMessage('News deleted successfully!');
        },
        error: (err) => {
          this.error = 'Failed to delete news: ' + (err.message || 'Unknown error');
          this.formSubmitting = false;
        }
      });
  }

  // Utility methods
  isFormValid(form: CreateNewsRequest | UpdateNewsRequest): boolean {
    return !!(form.title.trim() && form.content.trim() && form.imageUrl.trim());
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  refreshData(): void {
    this.searchTerm = '';
    this.error = '';
    this.fetchNews();
  }

  private showSuccessMessage(message: string): void {
    // You can implement a toast notification here
    console.log(message);
  }

  trackByNewsId(index: number, newsItem: News): number {
    return newsItem.id || index;
  }
}
