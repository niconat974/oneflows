import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, Page } from '../../models/category.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <button class="toggle-btn" (click)="toggleSidebar()">
          {{ isCollapsed ? '→' : '←' }}
        </button>
        <h2 *ngIf="!isCollapsed">Catégories</h2>
      </div>

      <div class="sidebar-content" *ngIf="!isCollapsed">
        <div class="categories">
          <div class="category" *ngFor="let category of categories">
            <div class="category-header">
              <span class="expand-icon" (click)="toggleCategory(category)">
                {{ category.isExpanded ? '▼' : '▶' }}
              </span>
              <span class="category-name" (click)="toggleCategory(category)">
                {{ category.name }}
              </span>
              <button class="delete-btn" (click)="deleteCategory(category)">×</button>
            </div>

            <div class="pages" *ngIf="category.isExpanded">
              <div class="page" 
                   *ngFor="let page of category.pages"
                   (click)="selectPage(category, page)"
                   [class.active]="selectedPage?.id === page.id">
                {{ page.title }}
                <button class="delete-btn" (click)="deletePage(category, page, $event)">×</button>
              </div>
              <div class="add-page">
                <input #newPage
                       type="text"
                       placeholder="Nouvelle page"
                       (keyup.enter)="addPage(category, newPage.value); newPage.value = ''">
              </div>
            </div>
          </div>
        </div>

        <div class="add-category">
          <input #newCategory
                 type="text"
                 placeholder="Nouvelle catégorie"
                 (keyup.enter)="addCategory(newCategory.value); newCategory.value = ''">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 300px;
      height: 100vh;
      background: #f5f5f5;
      border-right: 1px solid #ddd;
      transition: width 0.3s ease;
      overflow-x: hidden;
    }

    .sidebar.collapsed {
      width: 50px;
    }

    .sidebar-header {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid #ddd;
    }

    .toggle-btn {
      padding: 0.5rem;
      background: none;
      border: 1px solid #ddd;
      cursor: pointer;
      border-radius: 4px;
    }

    .sidebar-content {
      padding: 1rem;
    }

    .category {
      margin-bottom: 1rem;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      background: #eee;
      border-radius: 4px;
    }

    .expand-icon {
      font-size: 0.8rem;
    }

    .category-name {
      flex-grow: 1;
    }

    .pages {
      margin-left: 1.5rem;
      margin-top: 0.5rem;
    }

    .page {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 4px;
    }

    .page:hover {
      background: #eee;
    }

    .page.active {
      background: #007bff;
      color: white;
    }

    .delete-btn {
      padding: 0.2rem 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
    }

    .delete-btn:hover {
      color: #dc3545;
    }

    .add-category input,
    .add-page input {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class SidebarComponent {
  @Output() pageSelected = new EventEmitter<{category: Category, page: Page}>();
  
  isCollapsed = false;
  categories: (Category & {isExpanded?: boolean})[] = [
    {
      id: 1,
      name: 'Personnel',
      isExpanded: true,
      pages: [
        { id: 1, title: 'Notes quotidiennes', notes: [] },
        { id: 2, title: 'Idées', notes: [] }
      ]
    }
  ];
  selectedPage: Page | null = null;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleCategory(category: Category & {isExpanded?: boolean}) {
    category.isExpanded = !category.isExpanded;
  }

  addCategory(name: string) {
    if (name.trim()) {
      this.categories.push({
        id: this.categories.length + 1,
        name,
        pages: [],
        isExpanded: true
      });
    }
  }

  deleteCategory(category: Category) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categories = this.categories.filter(c => c.id !== category.id);
    }
  }

  addPage(category: Category, title: string) {
    if (title.trim()) {
      category.pages.push({
        id: Math.max(0, ...category.pages.map(p => p.id || 0)) + 1,
        title,
        categoryId: category.id,
        notes: []
      });
    }
  }

  deletePage(category: Category, page: Page, event: Event) {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      category.pages = category.pages.filter(p => p.id !== page.id);
    }
  }

  selectPage(category: Category, page: Page) {
    this.selectedPage = page;
    this.pageSelected.emit({category, page});
  }
}