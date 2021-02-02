import { Event } from './../notes/model/Event';

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notebook} from "../notes/model/notebook";
import {FeedbackViewModel} from "../feedback/feedback.component";
import {Note} from "../notes/model/note";
import { NumberValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL ="http://localhost:8082/api";
  public ALL_NOTEBOOKS_URL = `${this.BASE_URL}/notebooks`;
  private SEND_FEEDBACK_URL = `${this.BASE_URL}/feedback`;
  private SAVE_UPDATE_NOTEBOOK = `${this.BASE_URL}/notebooks`;
  private DELETE_NOTEBOOK_URL = `${this.BASE_URL}/deleteNotebook/`;
  private ALL_NOTES_URL = `${this.BASE_URL}/notes`;
  private NOTES_BY_NOTEBOOK_URL = `${this.BASE_URL}/NotebyNotebook/`;
  private SAVE_UPDATE_NOTE_URL = `${this.BASE_URL}/notes`;
  private DELETE_NOTE_URL = `${this.BASE_URL}/deleteNote/`;

  public ALL_TRAINING_URL = `${this.BASE_URL}/training/all`;

  public ALL_EVENT_URL = `${this.BASE_URL}/events`;
  private SAVE_UPDATE_EVENT_URL = `${this.BASE_URL}/event/`;
  private DELETE_Event_URL = `${this.BASE_URL}/deleteEvent/`;

  constructor(private http: HttpClient) {

  }

  getAllNotebooks(): Observable<Notebook[]> {
    console.log(this.http.get<Notebook[]>(this.ALL_NOTEBOOKS_URL));
    return this.http.get<Notebook[]>(this.ALL_NOTEBOOKS_URL);
  }

  postFeedback(feedback: FeedbackViewModel): Observable<any> {
    return this.http.post(this.SEND_FEEDBACK_URL, feedback);
  }

  postNotebook(notebook: Notebook): Observable<Notebook> {
    return this.http.post<Notebook>(this.SAVE_UPDATE_NOTEBOOK, notebook);
  }

  deleteNotebook(id: number): Observable<any> {
    return this.http.delete(this.DELETE_NOTEBOOK_URL + id);
  }

  getAllNotes(): Observable<Note[]> { 
    return this.http.get<Note[]>(this.ALL_NOTES_URL);
  }

  getNotesByNotebook(notebookId: number): Observable<Note[]> {
    return this.http.get<Note[]>(this.NOTES_BY_NOTEBOOK_URL + notebookId);
  }

  saveNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.SAVE_UPDATE_NOTE_URL, note);
  }

  deleteNote(noteId:number):Observable<any>{
    return this.http.delete(this.DELETE_NOTE_URL + noteId);
  }

  getAllEvents(): Observable<Event[]> { 
    return this.http.get<Event[]>(this.ALL_EVENT_URL);
  }

  saveEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.SAVE_UPDATE_EVENT_URL, event);
  }
  deleteEvent(eventId:number):Observable<any>{
    return this.http.delete(this.DELETE_Event_URL + eventId);
  }
}
