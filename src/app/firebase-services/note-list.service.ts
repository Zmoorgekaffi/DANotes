import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, collectionData, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from '@angular/fire/firestore';
import { Observable, count } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {

  firestore: Firestore = inject(Firestore);

  normalNotes: Note[] = [];
  markedNotes: Note[] = [];
  trashNotes: Note[] = [];

  unsubNotes;
  unsubTrash;
  unsubMarkedNotes;

  constructor() {

    this.unsubNotes = this.subNotes();
    this.unsubTrash = this.subTrash();
    this.unsubMarkedNotes = this.subMarkedNotes();
    setTimeout(() => {
      console.log(this.trashNotes);
      
    }, 2000);
  }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  async updateNote( note: Note) {
    if(note.id) {
      let colRef = this.transformDocTypeToColRef(note);
      updateDoc(this.getSingleDocRef(colRef, note.id), this.getCleanJSON(note) ).catch( (err) => {
        console.warn(err);
      });
    }
  }

  async delteNote(note:Note ,colRef: string, noteID:string) {
    if(note) {
      await deleteDoc(this.getSingleDocRef(colRef, noteID)).catch( (err) => {
        console.warn(err);
      });
    }
  }

  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    };
  }

  transformDocTypeToColRef(note:Note): string{
    if(note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async uploadDoc(note: Note, colID:string) {
    await addDoc(this.getNotesRef(colID), note).catch( (err) =>{
      console.warn(err);
    }).then( (docRef) => {
      console.log('document written with ID: ', docRef?.id);
    } )
  }

subNotes() {
  return onSnapshot(this.getNotesRef('notes'), (list) => {
    this.normalNotes = [];
    list.forEach(listItem => {
      this.normalNotes.push(this.setNoteObject(listItem.data(), listItem.id));
    });
  });
}

  // subNotes() {
  //   let ref = collection(this.firestore, 'notes/jpDrcwpeLJ7Ow8MPjhbd/notesExtra');
  //   return onSnapshot(ref, (list) => {
  //     this.normalNotes = [];
  //     list.forEach(listItem => {
  //       this.normalNotes.push(this.setNoteObject(listItem.data(), listItem.id));
  //     });
  //   });
  // }

  subMarkedNotes() {
    const q = query(this.getNotesRef('notes'), where("marked", "==", true));
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach(listItem => {
        this.markedNotes.push(this.setNoteObject(listItem.data(), listItem.id));
      });
    });
  }

  subTrash() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
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

  getNotesRef(colID: string) {
    return collection(this.firestore, colID);
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(collectionID: string, docID: string) {
    return doc(collection(this.firestore, collectionID), docID)
  }
}
