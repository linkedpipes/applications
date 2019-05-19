/**
 * Model class for storing person's invitations.
 */
export default class Invitation {
  senderWebId: string;

  recipientWebId: string;

  appMetadataUrl: string;

  object: Object;

  constructor(invitation: Object) {
    this.senderWebId = invitation.actor;
    this.recipientWebId = invitation.target;
    this.appMetadataUrl = invitation.object.href;
    this.object = invitation;
  }
}
