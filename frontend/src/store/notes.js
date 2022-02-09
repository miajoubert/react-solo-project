import { csrfFetch } from "./csrf";

const LIST_NOTES = 'notes/LIST';
const LIST_NOTE = 'notes/ONE'
const ADD_NOTE = 'notes/ADD_NOTE';
const UPDATE_NOTE = 'notes/UPDATE_NOTE';
const DELETE_NOTE = 'notes/DELETE_NOTE';

const list = (notes) => ({
  type: LIST_NOTES,
  notes
})

const one = (note) => ({
  type: LIST_NOTE,
  note
})

const add = (note) => ({
  type: ADD_NOTE,
  note
})

const update = (payload) => ({
  type: UPDATE_NOTE,
  payload
})

const remove = (note) => ({
  type: DELETE_NOTE,
  note
})

export const listNotes = (userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/notes`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "data": userId }
  });
  const notes = await response.json();
  dispatch(list(notes))
}

export const noteDetails = (noteId) => async (dispatch) => {
  const response = await csrfFetch(`/api/notes/${noteId}`)
  const note = await response.json();
  dispatch(one(note))
}

export const addNote = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/notes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });
  const note = await response.json();

  dispatch(add(note));
}

export const updateNote = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/notes/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const note = await response.json();
  dispatch(update(payload));
}

export const deleteNote = (noteId) => async (dispatch) => {
  const note = await csrfFetch(`/api/notes/${noteId}`,
    { method: "DELETE" }
  );
  dispatch(remove(note));
}

const initialState = {};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LIST_NOTES:
      const newState = { ...state };
      // console.log("ACTION dot NOTES!!!!!", action.notes)
      action.notes.forEach((note) => {
        newState[note.id] = note;
      });
      // console.log("NEW STATE!!!!!!!!!!!!", newState)
      return newState;
    case LIST_NOTE:
      const oneState = { ...state };
      oneState[action.note.id] = action.note;
      return oneState;
    case ADD_NOTE:
      const addState = {
        ...state,
        [action.note.id]: action.note
      };
      console.log("MY NEW STATE", addState)
      return addState;
    case UPDATE_NOTE:
      return {
        ...state,
        [action.noteId]: action.note
      }
    case DELETE_NOTE:
      const deleteState = { ...state };
      delete deleteState[action.note.id];
      return deleteState;
    default:
      return state;
  }
}

export default notesReducer;
