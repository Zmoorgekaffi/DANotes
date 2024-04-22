import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, collectionData, doc, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable, count } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {

  firestore: Firestore = inject(Firestore);

  normalNotes: Note[] = [];
  trashNotes: Note[] = [];

  unsubNotes;
  unsubTrash;

  constructor() {

    this.unsubNotes = this.subNotes();
    this.unsubTrash = this.subTrash();
  }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  async uploadDoc(item: Note) {
    await addDoc(this.getNotesRef(), item).catch( (err) =>{
      console.warn(err);
    }).then( (docRef) => {
      console.log('document written with ID: ', docRef?.id);
    } )
  }

  subNotes() {
    return onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(listItem => {
        this.normalNotes.push(this.setNoteObject(listItem.data(), listItem.id));
      });
    });
  }

  subTrash() {
    return onSnapshot(this.getTrashRef(), (list) => {
      list.forEach(listItem => {
        this.trashNotes.push(this.setTrashObject(listItem.data(), listItem.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    }
  }

  setTrashObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'trash',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(collectionID: string, docID: string) {
    return doc(collection(this.firestore, collectionID), docID)
  }
}
