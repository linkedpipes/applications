/**
 * Model class for storing person's invitations.
 */

import Invitation from './Invitation';

export default class AcceptedInvitation {
  senderWebId: string;

  recipientWebId: string;

  invitation: Invitation;

  invitationUrl: string;

  constructor(acceptedInvitation: Object, invitationUrl: string) {
    this.senderWebId = acceptedInvitation.actor;
    this.recipientWebId = acceptedInvitation.target;
    this.invitation = new Invitation(acceptedInvitation.object, undefined);
    this.invitationUrl = invitationUrl;
  }
}
