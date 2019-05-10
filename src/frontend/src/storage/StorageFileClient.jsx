import { Log } from '@utils';
import { Utils } from './utils';

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
    const url = `${path}/${fileName}`;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );
    return authClient.fetch(url).then(this.assertSuccessfulResponse);
  };

  fetchFolder = async (path, folderName = '') => {
    const url = `${path}/${folderName}`;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );
    return authClient
      .fetch(url, { headers: { Accept: 'text/turtle' } })
      .then(this.assertSuccessfulResponse);
  };

  createFolder = async (path, folderName) => {
    if (await this.folderExists(path, folderName)) return new Response();

    Log.info(`creating folder at ${path}/${folderName}`);

    return this.createItem(
      path,
      folderName,
      '',
      '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
    );
  };

  createFile = async (path, fileName, content) => {
    Log.info(`creating file at ${path}/${fileName}`);
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

    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );
    return authClient.fetch(path, request);
  };

  removeItem = async (path, itemName) => {
    const url = `${path}/${itemName}`;
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );
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

  readFolder = async (path: string, folderName?: string) => {
    const url = `${path}/${folderName}`;

    const response = await this.fetchFolder(path, folderName);
    const folderRDF = await response.text();
    const graph = await Utils.text2graph(folderRDF, url, 'text/turtle');
    const folderItems = Utils.getFolderItems(graph, url);

    return folderItems;
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
    return `${path}/${folderName}/`;
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
    const destinationUrl = `${destinationPath}/${destinationName}`;
    const fileResponse = await this.fetchFile(originPath, originName);
    const content =
      fileResponse.headers.get('Content-Type') === 'application/json'
        ? await fileResponse.text()
        : await fileResponse.blob();
    Log.info(content);

    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

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

  copyFolder = async (
    originPath: string,
    originName: string,
    destinationPath: string,
    destinationName: string
  ) => {
    await this.createFolder(destinationPath, destinationName);

    const { files, folders } = await this.readFolder(originPath, originName);

    const promises = [
      ...files.map(({ name }) =>
        this.copyFile(
          `${originPath}/${originName}`,
          name,
          `${destinationPath}/${destinationName}`,
          name
        )
      ),
      ...folders.map(({ name }) =>
        this.copyFolder(
          `${originPath}/${originName}`,
          name,
          `${destinationPath}/${destinationName}`,
          name
        )
      )
    ];

    await Promise.all(promises);
    return new Response();
  };

  sendInviteToInbox = async (url, data) => {
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    return authClient.fetch(url, {
      method: 'POST',
      body: data
    });
  };

  assertSuccessfulResponse = (response: Response) => {
    if (!response.ok) throw response;
    return response;
  };

  executeSPARQLUpdateForUser = async (url, query) => {
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );

    return authClient.fetch(url, {
      method: 'PATCH',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    });
  };
}

export default new StorageFileClient();
