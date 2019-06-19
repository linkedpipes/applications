import Person from './Person';

/**
 * Model class for storing person's invitations.
 */
export default class Invitation {
  senderWebId: string;

  sender: Person;

  recipientWebId: string;

  recipient: Person;

  appMetadataUrl: string;

  object: Object;

  invitationUrl: string;

  constructor(
    sender: Person,
    recipient: Person,
    invitation: Object,
    invitationUrl: string
  ) {
    this.sender = sender;
    this.recipient = recipient;
    this.senderWebId = invitation.actor;
    this.recipientWebId = invitation.target;
    this.appMetadataUrl = invitation.object.href;
    this.object = invitation;
    this.invitationUrl = invitationUrl;
  }
}
