import { List, Record } from "immutable";

export const SkosConcept = Record({
  label: "",
  uri: "",
  schemeUri: "",
  linkUris: List()
});

export const optionModes = {
  ALWAYS_SELECT: "ALWAYS_SELECT",
  NEVER_SELECT: "NEVER_SELECT",
  USER_DEFINED: "USER_DEFINED"
};

export const Option = Record({
  skosConcept: new SkosConcept(),
  count: null,
  mode: optionModes.USER_DEFINED,
  selected: false
});
