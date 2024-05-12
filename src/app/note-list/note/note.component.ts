import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
    this.noteService.updateNote(this.note);
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash(){
    if(this.note.id) {
      this.note.type = 'trash';
      let noteID = this.note.id;
      delete this.note.id;
      this.noteService.uploadDoc(this.note, 'trash'); 
      this.note.type = 'note';     
      this.noteService.delteNote(this.note, 'notes' ,noteID);
    } else {
      console.warn('note hasnt an ID');
    }
  }

  moveToNotes(){
    if(this.note.id) {
      this.note.type = 'note';
      let noteID = this.note.id;
      delete this.note.id;
      this.noteService.uploadDoc(this.note, 'notes');
      this.noteService.delteNote(this.note, 'trash', noteID);
    }
  }

  deleteNote(){
    if(this.note.id) {    
      this.noteService.delteNote(this.note, 'trash' , this.note.id);
    } else {
      console.warn('note hasnt an ID');
    }
  }

  saveNote(){
    this.noteService.updateNote(this.note);
  }

}
