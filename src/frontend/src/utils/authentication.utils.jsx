const getWebIdIfSessionValid = async () => {
  return new Promise(async resolve => {
    const authClient = await import(
      /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
    );
    const session = await authClient.currentSession();

    if (!session) {
      resolve(undefined);
    } else {
      resolve(session.webId);
    }
  });
};

export default {
  getWebIdIfSessionValid
};
