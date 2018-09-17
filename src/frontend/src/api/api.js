import {
  DISCOVER_FROM_INPUT_URL,
  DISCOVER_FROM_URI_LIST_URL,
  PIPELINE_GROUPS_URL
} from "../constants";

import "whatwg-fetch";

const rest = (
  url,
  body = "",
  method = "POST",
  contentType = "application/json"
) => {
  return method === "POST"
    ? fetch(url, {
        method: method,
        body: body.constructor === File ? body : JSON.stringify(body),
        headers: {
          "Content-Type": contentType
        },
        credentials: "same-origin"
      })
    : fetch(url);
};

export async function postDiscoverFromTtl({ ttlFile }) {
  return rest(DISCOVER_FROM_INPUT_URL, ttlFile, "POST", undefined);
}

// TODO: refactor later, move to separate class responsible for api calls
export async function postDiscoverFromUriList({ datasourceUris }) {
  return rest(DISCOVER_FROM_URI_LIST_URL, datasourceUris, "POST", undefined);
}

export async function getPipelineGroups({ discoveryId }) {
  return rest(PIPELINE_GROUPS_URL(discoveryId), undefined, "GET", undefined);
}
