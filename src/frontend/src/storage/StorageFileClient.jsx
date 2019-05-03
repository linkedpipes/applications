import authClient from 'solid-auth-client';
import { Log } from '@utils';

class StorageFileClient {
  folderExists = async (path, folderName) => {
    try {
      await this.fetchFolder(path, folderName);
      return true;
    } catch (error) {
      if (error instanceof Response && error.status === 404) return false;

      throw error;
    }
  };

  fetchFile = async (path, fileName = '') => {
    const url = this.buildFileUrl(path, fileName);
    return authClient.fetch(url).then(this.assertSuccessfulResponse);
  };

  fetchFolder = async (path, folderName = '') => {
    const url = this.buildFolderUrl(path, folderName);
    return authClient
      .fetch(url, { headers: { Accept: 'text/turtle' } })
      .then(this.assertSuccessfulResponse);
  };

  createFolder = async (path, folderName) => {
    // if (await this.folderExists(path, folderName)) return new Response();

    return this.createItem(
      path,
      folderName,
      '',
      '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
    );
  };

  createFile = async (path, fileName, content) => {
    return this.createItem(
      path,
      fileName,
      content,
      '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    );
  };

  createItem = async (path, itemName, content, link) => {
    const request = {
      method: 'POST',
      headers: {
        link,
        slug: itemName,
        'Content-Type': undefined
      },
      body: content
    };

    return authClient.fetch(path, request);
  };

  removeItem = async (path, itemName) => {
    const url = `${path}/${itemName}`;
    const response = await authClient.fetch(url, {
      method: 'DELETE'
    });
    if (response.status === 409 || response.status === 301) {
      // Solid pod returns 409 if the item is a folder and is not empty
      // Solid pod returns 301 if is attempted to read a folder url without
      // '/' at the end (from buildFileUrl)
      return this.removeFolderRecursively(path, itemName);
    }
    if (response.status === 404) {
      // Don't throw if the item didn't exist
      return response;
    }
    this.assertSuccessfulResponse(response);
    return response;
  };

  removeFolderContents = async (path, folderName) => {
    const folderPath = `${path}/${folderName}`;

    const { files, folders } = await this.readFolder(path, folderName);
    const promises = [
      ...files.map(({ name }) => this.removeItem(folderPath, name)),
      ...folders.map(({ name }) =>
        this.removeFolderRecursively(folderPath, name)
      )
    ];
    await Promise.all(promises);
    return new Response();
  };

  removeFolderRecursively = async (path, folderName) => {
    await this.removeFolderContents(path, folderName);
    return this.removeItem(path, folderName);
  };

  updateItem = async (path, itemName, content, contentType) => {
    await this.removeItem(path, itemName);
    return this.createItem(path, itemName, content, contentType);
  };

  buildFolderUrl = async (path, folderName = '') => {
    return `${this.buildFileUrl(path, folderName)}/`;
  };

  buildFileUrl = async (path, fileName = '') => {
    let url =
      fileName === '.acl' ? `${path}${fileName}` : `${path}/${fileName}`;
    while (url.slice(-1) === '/') url = url.slice(0, -1);
    Log.info(url);

    return url;
  };

  copyFile = async (
    originPath,
    originName,
    destinationPath,
    destinationName
  ) => {
    const destinationUrl = this.buildFileUrl(destinationPath, destinationName);

    const fileResponse = await this.fetchFile(originPath, originName);
    const content =
      fileResponse.headers.get('Content-Type') === 'application/json'
        ? await fileResponse.text()
        : await fileResponse.blob();

    return authClient
      .fetch(destinationUrl, {
        method: 'PUT',
        body: content
      })
      .then(this.assertSuccessfulResponse);
  };

  renameFile = async (path, oldName, newName) => {
    await this.copyFile(path, oldName, path, newName);
    return this.removeItem(path, oldName);
  };

  renameFolder = async (path, oldFolderName, newFolderName) => {
    await this.copyFolder(path, oldFolderName, path, newFolderName);
    return this.removeFolderRecursively(path, oldFolderName);
  };

  assertSuccessfulResponse = (response: Response) => {
    if (!response.ok) throw response;
    return response;
  };
}

export default new StorageFileClient();
