export interface ContactAddress {
  street: string;
  state: string;
  postcode: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: ContactAddress;
  description: string;
}

/**
 * Shape used when creating a new contact, before the service
 * assigns it an id.
 */
export type ContactInput = Omit<Contact, 'id'>;
