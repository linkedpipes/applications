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
      if (element['@id'] === `${aclUrl}#Read`) {
        self.public = ACL('agentClass') in element;
      }
      if (!self.collaborators.includes(element)) {
        self.collaborators.push(element);
      }
    });
  }

  isPublic = (): boolean => {
    return this.public !== undefined;
  };

  getCollaborators = (): Array<string> => {
    const filteredCollaborators = this.collaborators.filter(object => {
      return ACL('agent') in object;
    });
    return filteredCollaborators.map(object => {
      return object[ACL('agent')][0]['@id'];
    });
  };
}
