import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  template: `
    <div class="notes-layout">
      <app-sidebar (pageSelected)="onPageSelected($event)"></app-sidebar>
      
      <div class="notes-content">
        <div class="notes-form">
          <h2>{{ editingNote ? 'Modifier la note' : 'Nouvelle note' }}</h2>
          <form [formGroup]="noteForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <input type="text" formControlName="title" placeholder="Titre">
            </div>
            <div class="form-group">
              <div class="editor-toolbar">
                <button type="button" (click)="triggerImageUpload()">
                  Ajouter une image
                </button>
                <input
                  type="file"
                  #imageInput
                  style="display: none"
                  accept="image/*"
                  multiple
                  (change)="onImagesSelected($event)"
                >
              </div>
              <textarea formControlName="content" placeholder="Contenu"></textarea>
              
              <div class="images-preview" *ngIf="selectedImages.length > 0">
                <div class="image-container" *ngFor="let image of selectedImages; let i = index">
                  <img [src]="image.url" [alt]="'Image ' + (i + 1)">
                  <button type="button" class="remove-image" (click)="removeImage(i)">×</button>
                </div>
              </div>
            </div>
            <button type="submit">{{ editingNote ? 'Mettre à jour' : 'Créer' }}</button>
            <button type="button" *ngIf="editingNote" (click)="cancelEdit()">Annuler</button>
          </form>
        </div>

        <div class="notes-list">
          <h2>Notes de la page : {{ currentPage?.title || 'Sélectionnez une page' }}</h2>
          <div class="note-card" *ngFor="let note of notes">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content }}</p>
            <div class="note-images" *ngIf="note.images?.length">
              <img *ngFor="let image of note.images" [src]="image.url" [alt]="image.name">
            </div>
            <div class="note-actions">
              <button (click)="editNote(note)">Modifier</button>
              <button (click)="deleteNote(note.id!)">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notes-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .notes-content {
      flex-grow: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .notes-form {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .editor-toolbar {
      margin-bottom: 1rem;
    }

    .images-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }

    .image-container {
      position: relative;
      width: 150px;
    }

    .image-container img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .remove-image {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(255, 255, 255, 0.8);
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }

    .note-card {
      background: white;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .note-images {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 1rem 0;
    }

    .note-images img {
      max-width: 200px;
      height: auto;
      border-radius: 4px;
    }

    .note-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    textarea {
      min-height: 200px;
    }
  `]
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  noteForm: FormGroup;
  editingNote: Note | null = null;
  currentPage: any = null;
  selectedImages: Array<{url: string, file: File, name: string}> = [];

  constructor(
    private noteService: NoteService,
    private formBuilder: FormBuilder
  ) {
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadNotes();
  }

  onPageSelected(event: {category: any, page: any}) {
    this.currentPage = event.page;
    this.loadNotes();
  }

  triggerImageUpload() {
    const imageInput = document.querySelector('#imageInput') as HTMLInputElement;
    imageInput?.click();
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            url: e.target.result,
            file: file,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  loadNotes() {
    if (this.currentPage) {
      this.noteService.getNotes().subscribe({
        next: (notes) => this.notes = notes,
        error: (error) => console.error('Erreur lors du chargement des notes:', error)
      });
    }
  }

  onSubmit() {
    if (this.noteForm.valid) {
      const noteData = {
        ...this.noteForm.value,
        images: this.selectedImages,
        pageId: this.currentPage?.id
      };
      
      if (this.editingNote) {
        this.noteService.updateNote(this.editingNote.id!, noteData).subscribe({
          next: () => {
            this.loadNotes();
            this.resetForm();
          },
          error: (error) => console.error('Erreur lors de la mise à jour:', error)
        });
      } else {
        this.noteService.createNote(noteData).subscribe({
          next: () => {
            this.loadNotes();
            this.resetForm();
          },
          error: (error) => console.error('Erreur lors de la création:', error)
        });
      }
    }
  }

  editNote(note: Note) {
    this.editingNote = note;
    this.noteForm.patchValue({
      title: note.title,
      content: note.content
    });
    this.selectedImages = note.images || [];
  }

  deleteNote(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => this.loadNotes(),
        error: (error) => console.error('Erreur lors de la suppression:', error)
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editingNote = null;
    this.noteForm.reset();
    this.selectedImages = [];
  }
}