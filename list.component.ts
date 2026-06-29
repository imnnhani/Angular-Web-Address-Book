import { Component, OnInit } from '@angular/core';
import { confirm } from 'devextreme/ui/dialog';

import { AddressBookService } from '../services/address-book.service';
import { Contact, ContactInput } from '../models/contact.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  /** Bound to the dx-data-grid's [dataSource]. */
  dataSource: Contact[] = [];

  /** Passed down to the modal for the State select box. */
  stateList: string[] = [];

  /** Controls the dx-popup's visible state. */
  popupVisible = false;

  /** The row that was clicked, or null when adding a new contact. */
  selectedContact: Contact | null = null;

  constructor(private addressBookService: AddressBookService) {}

  ngOnInit(): void {
    this.addressBookService.contacts$.subscribe((list) => {
      this.dataSource = list;
    });
    this.stateList = this.addressBookService.getStateList();
  }

  /** Combines street + state + postcode into a single display string. */
  calculateAddress = (rowData: Contact): string => {
    const { street, state, postcode } = rowData.address;
    return [street, state, postcode].filter(Boolean).join(', ');
  };

  /** Toolbar "Add" button: opens the popup with an empty form. */
  onAddClick = (): void => {
    this.selectedContact = null;
    this.popupVisible = true;
  };

  /** Grid row click: opens the popup populated with that row's data. */
  onRowClick(e: any): void {
    if (e.rowType !== 'data') {
      return;
    }
    // Clone so edits in the modal don't mutate the grid's row directly.
    this.selectedContact = {
      ...e.data,
      address: { ...e.data.address },
    };
    this.popupVisible = true;
  }

  /** Row delete button: confirms, then removes the contact from the service. */
  onDeleteClick = (e: any): void => {
    e.event.stopPropagation();
    const contact: Contact = e.row.data;
    confirm(
      `Are you sure you want to delete <b>${contact.name}</b>?`,
      'Confirm Delete'
    ).then((confirmed: boolean) => {
      if (confirmed) {
        this.addressBookService.deleteContact(contact.id);
      }
    });
  };

  /** Modal "Create" emit: inserts the new contact and closes the popup. */
  onCreate(contact: ContactInput): void {
    this.addressBookService.insertContact(contact);
    this.popupVisible = false;
  }

  /** Modal "Save" emit: updates the existing contact and closes the popup. */
  onUpdate(contact: Contact): void {
    this.addressBookService.updateContact(contact);
    this.popupVisible = false;
  }

  /** Modal "Cancel" emit: dismisses the popup without changes. */
  onCancel(): void {
    this.popupVisible = false;
  }

  /** Resets selection once the popup is fully hidden. */
  onPopupHiding(): void {
    this.selectedContact = null;
  }
}
