import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss']
})
export class AddNoteDialogComponent {
  @Output() addDialogClosed: EventEmitter<boolean> = new EventEmitter();
  title = "";
  description = "";
  // noteService = inject(NoteListService);

  constructor(private noteService: NoteListService) { }
// 

  

  closeDialog() {
    this.title = "";
    this.description = "";
    console.log(this.title);
    console.log(this.description);
    this.addDialogClosed.emit(false);
  }

  addNote() {
    let notee: Note = {
      type: "note",
      title: this.title || 'no title',
      content: this.description || 'no description',
      marked: false
    }
    this.noteService.uploadDoc(notee, 'notes');
    this.closeDialog();
  }
}
