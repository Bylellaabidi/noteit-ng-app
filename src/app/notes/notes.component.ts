import { ApiService } from './../shared/api.service';
import { HttpClient } from '@angular/common/http';
import {Component, OnInit,ViewChild} from '@angular/core';
import {Notebook} from "./model/notebook";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {Note} from "./model/note";
import { TokenStorageService } from './../shared/token-storage.service';
import {Router} from "@angular/router"

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notebooks: Notebook[] = [];
  notes: Note[] = [];
  selectedNotebook: Notebook;
  searchText: string;
  selectedLevel;
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

  StaticNote:Note = {
    id: null,
    title: "Test colo background Note",
    text: "Write some text in here",
    lastModifiedOn: '03/12/2020',
    notebookId: 1
  };
  isLoggedIn = true;
  user:any;
  @ViewChild('myModal') myModal: any;
  constructor(private apiService: ApiService, 
    private modalService: NgbModal,
    private router: Router,
    private tokenStorageService: TokenStorageService) {
  }
  ngOnInit() {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn )
    {
      this.getAllNotebooks();
      this.getAllNotes();
       this.user = this.tokenStorageService.getUser();
   }
    else
    {
      this.router.navigate(['/login']);
    }
  }
  
  public getAllNotebooks() {
    this.apiService.getAllNotebooks().subscribe(
      res => {
        this.notebooks = res;
       
      },
      err => {
        alert("An error has occurred;")
      }
    );
  }

  getAllNotes(){
    this.apiService.getAllNotes().subscribe(
      res => {
        this.notes = res;
      },
      err => {alert("Error occurred while downloading the notes;")}
    );
  console.log("notes nbre : "+this.notes.length)
  }

  createNotebook() {
    let newNotebook:Notebook = {
      name:'New notebook',
      id: null,
      nbOfNotes: 0
    };

    this.apiService.postNotebook(newNotebook).subscribe(
      res => {
        newNotebook.id = res.id;
        this.notebooks.push(newNotebook);
      },
      err => {alert("An error has occurred while saving the notebook");}
    );

  }

  updateNotebook(updatedNotebook: Notebook) {
    this.apiService.postNotebook(updatedNotebook).subscribe(
      res => {

      },
      err => {alert("An error has occurred while saving the notebook");}
    );
  }

  deleteNotebook(notebook: Notebook) {
    if(confirm("Are you sure you want to delete notebook?")){
      this.apiService.deleteNotebook(notebook.id).subscribe(
        res => {
          let indexOfNotebook = this.notebooks.indexOf(notebook);
          this.notebooks.splice(indexOfNotebook,1);
        },
        err => {
          alert("Could not delete notebook");
        }
      );
    }
  }

  deleteNote(note: Note){
    if(confirm("Are you sure you want to delete this note?")){
      this.apiService.deleteNote(note.id).subscribe(
        res =>{
          let indexOfNote = this.notes.indexOf(note);
          this.notes.splice(indexOfNote, 1);
        },
        err=>{alert("An error has occurred deleting the note");}
      );
    }
  }

  createNote(notebookId: number) {
    this.openModal();
    this.selected();
    let newNote:Note = {
      id: null,
      title: "New Note",
      text: "Write some text in here",
      lastModifiedOn: null,
      notebookId: notebookId
    };

    this.apiService.saveNote(newNote).subscribe(
      res => {
        newNote.id = res.id;
        this.notes.push(newNote);
      },
      err => {alert("An error occurred while saving the note");}
    );
  }

  selectNotebook(notebook: Notebook) {
    this.selectedNotebook = notebook;
    this.apiService.getNotesByNotebook(notebook.id).subscribe(
      res=> {
        this.notes = res;
      },
      err =>{alert("An error has occurred while downloading the notes;")}
    );
  }

  updateNote(updatedNote: Note) {
    this.apiService.saveNote(updatedNote).subscribe(
      res => {
      },
      err => {alert("An error occurred while saving the note");}
    );
  }

  selectAllNotes() {
    this.selectedNotebook = null;
    this.getAllNotes();
  }

  openModal() {
    this.modalService.open(this.myModal);
  }
  selected():string{
    console.log(this.selectedLevel.name)
    if(this.selectedLevel.name.length !=0)
    return this.selectedLevel.name;
    else
    return 'warning';
  }
  
}
