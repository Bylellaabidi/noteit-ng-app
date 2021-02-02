import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from "../model/note";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() note: Note;
  @Output() noteUpdated: EventEmitter<Note> = new EventEmitter<Note>();
  @Output() noteDeleted: EventEmitter<Note> = new EventEmitter<Note>();

  selectedLevel;
  colored:boolean=true;
  data:Array<Object> = [
      {id: 0, name: "primary"},
      {id: 1, name: "secondary"},
      {id: 2, name: "success"},
      {id: 3, name: "warning"},
      {id: 4, name: "info"},
      {id: 5, name: "light"},
      {id: 6, name: "dark"},
      {id: 7, name: "danger"}
  ];
  screenColor="danger";
  constructor() {
  }

  ngOnInit() {
  }

  updateNote() {
    this.noteUpdated.emit(this.note);
  }

  deleteNote() {
    this.noteDeleted.emit(this.note);
  }
  selected():string{
    console.log(this.selectedLevel.name)
    if(this.selectedLevel.name.length !=0)
    return this.selectedLevel.name;
    else
    return 'warning';
  }
}

