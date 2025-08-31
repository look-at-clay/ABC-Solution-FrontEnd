// components/news-management/news-management.component.ts
import { Component, OnInit } from '@angular/core';
import { News, CreateNewsRequest, UpdateNewsRequest } from '../../models/news.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-management',
  standalone: false,
  templateUrl: './news-management.component.html',
  styleUrls: ['./news-management.component.css']
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
    content: ''
  };
  
  selectedFiles: File[] = [];
  editSelectedFiles: File[] = [];
  
  editForm: UpdateNewsRequest = {
    title: '',
    content: ''
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
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEgzNVYzMEgyNVYyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+dGV4dCB4PSI0MCIgeT0iMzgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
      target.style.objectFit = 'cover';
    }
  }

  // Modal methods
  openAddModal(): void {
    this.newsForm = {
      title: '',
      content: ''
    };
    this.selectedFiles = [];
    this.showAddModal = true;
  }

  openEditModal(newsItem: News): void {
    this.selectedNews = newsItem;
    this.editForm = {
      title: newsItem.title,
      content: newsItem.content
    };
    this.editSelectedFiles = [];
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
    this.selectedFiles = [];
    this.editSelectedFiles = [];
    this.formSubmitting = false;
  }

  // File handling methods
  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.selectedFiles = Array.from(target.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onEditFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.editSelectedFiles = Array.from(input.files);
    }
  }

  removeEditFile(index: number): void {
    this.editSelectedFiles.splice(index, 1);
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  // CRUD operations
  addNews(): void {
    if (!this.isAddFormValid()) {
      return;
    }

    this.formSubmitting = true;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', this.newsForm.title);
    formData.append('content', this.newsForm.content);
    
    // Append selected files
    this.selectedFiles.forEach((file, index) => {
      formData.append('images', file);
    });

    this.newsService.createNewsWithFormData(formData)
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
    if (!this.selectedNews || !this.isEditFormValid()) {
      return;
    }

    this.formSubmitting = true;
    
    // Create FormData for partial update
    const formData = new FormData();
    
    // Only append fields that have values (partial update)
    if (this.editForm.title && this.editForm.title.trim()) {
      formData.append('title', this.editForm.title.trim());
    }
    if (this.editForm.content && this.editForm.content.trim()) {
      formData.append('content', this.editForm.content.trim());
    }
    
    // Append selected files if any
    this.editSelectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.newsService.partialUpdateNews(this.selectedNews.id!, formData)
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
    return !!(form.title.trim() && form.content.trim());
  }

  isAddFormValid(): boolean {
    return !!(this.newsForm.title?.trim() && this.newsForm.content?.trim() && this.selectedFiles.length > 0);
  }

  isEditFormValid(): boolean {
    // For partial update, at least one field should be provided
    const hasTitle = this.editForm.title?.trim();
    const hasContent = this.editForm.content?.trim();
    const hasFiles = this.editSelectedFiles.length > 0;
    return !!(hasTitle || hasContent || hasFiles);
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
