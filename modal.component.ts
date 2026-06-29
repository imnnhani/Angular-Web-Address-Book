import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Contact, ContactInput } from '../models/contact.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnChanges {
  /** The row clicked in the parent grid, or null when adding a new contact. */
  @Input() contact: Contact | null = null;

  /** Options for the State select box, supplied by the service via the parent. */
  @Input() stateList: string[] = [];

  /** Emits a brand-new contact (no id yet) for the parent to insert. */
  @Output() create = new EventEmitter<ContactInput>();

  /** Emits an edited contact (with id) for the parent to update. */
  @Output() update = new EventEmitter<Contact>();

  /** Emits when Cancel is pressed, so the parent can close the popup. */
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  /** True while fields are editable. Always true for a brand-new contact. */
  isEditing = false;

  constructor(private fb: FormBuilder) {
    this.form = this.buildForm();
  }

  /** True when there's no existing contact, i.e. this is the "Add" flow. */
  get isNew(): boolean {
    return !this.contact;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['contact']) {
      return;
    }

    this.form = this.buildForm();

    if (this.contact) {
      // Existing record: populate the form and start in read-only view mode.
      this.form.patchValue({
        name: this.contact.name,
        email: this.contact.email,
        phone: this.contact.phone,
        street: this.contact.address?.street ?? '',
        state: this.contact.address?.state ?? '',
        postcode: this.contact.address?.postcode ?? '',
        description: this.contact.description ?? '',
      });
      this.isEditing = false;
      this.form.disable();
    } else {
      // New record: blank form, immediately editable.
      this.isEditing = true;
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[^a-zA-Z]*$/)]],
      street: [''],
      state: [''],
      postcode: ['', [Validators.pattern(/^[0-9]*$/)]],
      description: [''],
    });
  }

  /** "Edit" button: unlocks the fields and swaps the button to "Save". */
  onEditClick(): void {
    this.isEditing = true;
    this.form.enable();
  }

  /** "Create" button: emits a new contact built from the form values. */
  onCreateClick(): void {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const newContact: ContactInput = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      address: {
        street: value.street,
        state: value.state,
        postcode: value.postcode,
      },
      description: value.description,
    };
    this.create.emit(newContact);
  }

  /** "Save" button: emits the updated contact, keeping its original id. */
  onSaveClick(): void {
    if (this.form.invalid || !this.contact) {
      return;
    }
    const value = this.form.getRawValue();
    const updatedContact: Contact = {
      ...this.contact,
      name: value.name,
      email: value.email,
      phone: value.phone,
      address: {
        street: value.street,
        state: value.state,
        postcode: value.postcode,
      },
      description: value.description,
    };
    this.update.emit(updatedContact);
  }

  /** "Cancel" button: tells the parent to close the popup, no changes made. */
  onCancelClick(): void {
    this.cancel.emit();
  }
}
