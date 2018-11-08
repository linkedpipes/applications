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
  options: new Map(),
  optionsUris: new List()
});
