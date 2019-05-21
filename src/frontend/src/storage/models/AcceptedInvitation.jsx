/**
 * Model class for storing person's invitations.
 */

import Invitation from './Invitation';
import Person from './Person';

export default class AcceptedInvitation {
  senderWebId: string;

  sender: Person;

  recipientWebId: string;

  recipient: Person;

  invitation: Invitation;

  invitationUrl: string;

  constructor(
    sender: Person,
    recipient: Person,
    acceptedInvitation: Object,
    invitationUrl: string
  ) {
    this.sender = sender;
    this.recipient = recipient;
    this.senderWebId = acceptedInvitation.actor;
    this.recipientWebId = acceptedInvitation.target;
    this.invitation = new Invitation(
      recipient,
      sender,
      acceptedInvitation.object,
      undefined
    );
    this.invitationUrl = invitationUrl;
  }
}
