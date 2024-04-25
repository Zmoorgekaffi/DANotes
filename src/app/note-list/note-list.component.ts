import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  favFilter: "all" | "fav" = "all";
  status: "notes" | "trash" = "notes";
  

  constructor(public noteService: NoteListService) {
  }

  changeFavFilter(filter: "all" | "fav") {
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.status == "trash") {
      this.status = "notes";
    } else {
      this.status = "trash";
      this.favFilter = "all";
    }
  }

}
