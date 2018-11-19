import { List, Record } from "immutable";

export const filterTypes = {
  CHECKBOX: "CHECKBOX",
  RADIO: "RADIO"
};

export const Filter = Record({
  property: "new Property()",
  type: filterTypes.CHECKBOX,
  enabled: true,
  expanded: false,
  options: {},
  optionsUris: []
});

export const ADD_FILTERS = "ADD_FILTERS";
export const ADD_FILTER = "ADD_FILTER";
export const TOGGLE_FILTER = "TOGGLE_FILTER";
export const TOGGLE_EXPAND_FILTER = "TOGGLE_EXPAND_FILTER";
