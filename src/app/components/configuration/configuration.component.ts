import { Component, OnInit } from '@angular/core';
import { Configuration, ConfigurationUpdateRequest } from '../../models/configuration.model';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-configuration',
  standalone: false,
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  configurations: Configuration[] = [];
  editingConfig: Configuration | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private configurationService: ConfigurationService) {}

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations(): void {
    this.isLoading = true;
    this.configurationService.getAllConfigurations().subscribe({
      next: (data) => {
        this.configurations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load configurations';
        this.isLoading = false;
        console.error('Error loading configurations:', error);
      }
    });
  }

  startEdit(config: Configuration): void {
    this.editingConfig = { ...config };
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingConfig = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveConfiguration(): void {
    if (!this.editingConfig) return;

    const updateRequest: ConfigurationUpdateRequest = {
      configKey: this.editingConfig.configKey,
      configDescription: this.editingConfig.configDescription,
      configValue: this.editingConfig.configValue
    };

    this.configurationService.updateConfiguration(this.editingConfig.id, updateRequest).subscribe({
      next: (updatedConfig) => {
        const index = this.configurations.findIndex(c => c.id === updatedConfig.id);
        if (index !== -1) {
          this.configurations[index] = updatedConfig;
        }
        this.editingConfig = null;
        this.successMessage = 'Configuration updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update configuration';
        console.error('Error updating configuration:', error);
      }
    });
  }
}