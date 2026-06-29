import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Contact, ContactInput } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class AddressBookService {
  /** Auto-incrementing id counter for new contacts. */
  private nextId = 1;

  /** The in-memory address book "table". */
  private addressBookList: Contact[] = [];

  /** Stream the parent component subscribes to for live updates. */
  private addressBookList$ = new BehaviorSubject<Contact[]>([]);

  /** List of selectable states used by the modal's state Select Box. */
  private stateList: string[] = [
    'Johor',
    'Kedah',
    'Kelantan',
    'Malacca',
    'Negeri Sembilan',
    'Pahang',
    'Penang',
    'Perak',
    'Perlis',
    'Sabah',
    'Sarawak',
    'Selangor',
    'Terengganu',
    'Kuala Lumpur',
    'Labuan',
    'Putrajaya',
  ];

  constructor() {
    this.seed();
  }

  /** Observable list of contacts; the list component subscribes to this. */
  get contacts$(): Observable<Contact[]> {
    return this.addressBookList$.asObservable();
  }

  /** Returns a copy of the state list for the Select Box options. */
  getStateList(): string[] {
    return [...this.stateList];
  }

  /** Insert: assigns a new id and adds the contact to the list. */
  insertContact(contact: ContactInput): void {
    const newContact: Contact = {
      id: this.nextId++,
      ...contact,
    };
    this.addressBookList = [...this.addressBookList, newContact];
    this.publish();
  }

  /** Update: replaces the contact that matches the given id. */
  updateContact(contact: Contact): void {
    this.addressBookList = this.addressBookList.map((c) =>
      c.id === contact.id ? contact : c
    );
    this.publish();
  }

  /** Delete: removes the contact with the matching id. */
  deleteContact(id: number): void {
    this.addressBookList = this.addressBookList.filter((c) => c.id !== id);
    this.publish();
  }

  /** Pushes a fresh copy of the array to subscribers. */
  private publish(): void {
    this.addressBookList$.next([...this.addressBookList]);
  }

  /** A couple of sample contacts so the grid isn't empty on first load. */
  private seed(): void {
    this.insertContact({
      name: 'Hani Irwan',
      email: 'imnnhani@gmail.com',
      phone: '012-345 6789',
      address: { street: '12 Jalan Damai', state: 'Selangor', postcode: '47000' },
      description: 'IT student.',
    });
    this.insertContact({
      name: 'Adam Harman',
      email: 'adm.iskndr@gmail.com',
      phone: '019-876 5432',
      address: { street: 'Presint 15', state: 'Putrajaya', postcode: '62050' },
      description: 'University classmate.',
    });
  }
}
