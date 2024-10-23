import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:8080/api';
  
  private mockNotes: Note[] = [
    {
      id: 1,
      title: 'Note de test 1',
      content: 'Contenu de la note de test 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      pageId: 1,
      images: []
    },
    {
      id: 2,
      title: 'Note de test 2',
      content: 'Contenu de la note de test 2',
      createdAt: new Date(),
      updatedAt: new Date(),
      pageId: 1,
      images: []
    }
  ];

  constructor(private http: HttpClient) {}

  getNotes(pageId?: number): Observable<Note[]> {
    // Pour test en attendant que l'API soit prête
    return of(pageId ? this.mockNotes.filter(note => note.pageId === pageId) : this.mockNotes);
  }

  getNote(id: number): Observable<Note> {
    const note = this.mockNotes.find(n => n.id === id);
    return of(note!);
  }

  createNote(note: Note): Observable<Note> {
    const newNote = {
      ...note,
      id: this.mockNotes.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockNotes.push(newNote);
    return of(newNote);
  }

  updateNote(id: number, note: Note): Observable<Note> {
    const index = this.mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.mockNotes[index] = { ...note, id, updatedAt: new Date() };
      return of(this.mockNotes[index]);
    }
    return of(note);
  }

  deleteNote(id: number): Observable<void> {
    const index = this.mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.mockNotes.splice(index, 1);
    }
    return of(void 0);
  }
}