import 'whatwg-fetch';

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const rest = (
  url,
  body = '',
  method = 'POST',
  contentType = 'application/json'
) => {
  console.log('Sending request:\n');
  console.log(`URL: ${  url  }\n`);
  console.log(`Body: ${  JSON.stringify(body)  }\n`);
  console.log(`Method: ${  method  }\n`);

  return method === 'POST'
    ? fetch(url, {
        method,
        body: body.constructor === File ? body : JSON.stringify(body),
        headers: {
          'Content-Type': contentType
        },
        credentials: 'same-origin'
      }).then(handleErrors)
    : fetch(url).then(handleErrors);
};

export const BASE_URL = process.env.BASE_BACKEND_URL;
