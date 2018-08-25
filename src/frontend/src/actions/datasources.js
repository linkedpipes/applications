import uuid from "uuid";

// ADD_EXPENSE
export const addSource = ({ uri } = {}) => ({
  type: "ADD_SOURCE",
  expense: {
    id: uuid(),
    uri
  }
});

// REMOVE_SOURCE
export const removeExpense = ({ id } = {}) => ({
  type: "REMOVE_SOURCE",
  id
});

// EDIT_SOURCE
export const editExpense = (id, updates) => ({
  type: "EDIT_SOURCE",
  id,
  updates
});
