/**
 * Model class for storing person's notifications.
 */
export default class Notification {
  invitationUrl: string;

  senderWebId: string;

  recipientWebId: string;

  appMetadataUrl: string;

  constructor(
    invitationUrl: string,
    senderWebId: string,
    recipientWebId: string,
    appMetadataUrl: string
  ) {
    this.invitationUrl = invitationUrl;
    this.senderWebId = senderWebId;
    this.recipientWebId = recipientWebId;
    this.appMetadataUrl = appMetadataUrl;
  }
}
