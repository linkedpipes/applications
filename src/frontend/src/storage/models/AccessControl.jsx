/**
 * Model class for storing person's invitations.
 */

const ACL = term => {
  return `http://www.w3.org/ns/auth/acl#${term}`;
};

export default class AccessControl {
  originalAccessControl: Object;

  owner: Object;

  public: Object;

  collaborators: Array<Object>;

  aclUrl;

  constructor(accessControl: Object, aclUrl: string) {
    this.originalAccessControl = accessControl;
    this.collaborators = [];
    this.aclUrl = aclUrl;

    const self = this;

    accessControl.forEach(element => {
      if (element['@id'] === `${aclUrl}#public`) {
        self.public = element;
      } else if (element['@id'] === `${aclUrl}#owner`) {
        self.owner = element;
      } else {
        self.collaborators.push(element);
      }
    });
  }

  isPublic = (): boolean => {
    return this.public !== undefined;
  };

  getCollaborators = (): Array<string> => {
    return this.collaborators.map(object => {
      return object[ACL('agent')][0]['@id'];
    });
  };

  //   exportWithOptions = (isPublic, contacts) => {
  //     const jsonLdObject = [this.owner];
  //     contacts.forEach(contact => {
  //       const contactObject = this.collaborators.filter(object => {
  //         return object[ACL('agent')][0]['@id'] === contact.webId;
  //       });
  //       if (contactObject.length === 1) {
  //         jsonLdObject.push(contactObject.pop());
  //       }
  //     });
  //     if (isPublic && this.public) {
  //       jsonLdObject.push(this.public);
  //     }
  //     return jsonLdObject;
  //   };
}
