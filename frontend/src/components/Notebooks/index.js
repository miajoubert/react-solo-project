import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink, Route, useParams } from "react-router-dom";

import * as sessionActions from "../../store/session";
import FloatingButton from "../FloatingButton";
import NotebookDetail from "./NotebookDetail";
import NotebookForm from "./NotebookForm";
import { listNotebooks } from "../../store/notebooks";
import { listNotes } from "../../store/notes";


import './Notebooks.css'

const NotesPage = () => {
  const notebooks = useSelector(state => state.notebooks)
  const notes = useSelector(state => state.notes)
  const session = useSelector(state => state.session)
  const dispatch = useDispatch()

  const [showForm, setShowForm] = useState(false);

  const userId = session.user.id;
  const { notebookId } = useParams();
  const notebooksArr = Object.values(notebooks);

  useEffect(() => {
    dispatch(listNotebooks(userId))
    dispatch(listNotes(notebookId))
  }, [])

  if (!session.user) {
    return (
      <>
        <div>
          LOGGED OUT
        </div>
      </>
    )
  } else {
    return (
      <main>
        <nav
          className="notebookList">
          {notebooksArr.map((notebook) => {
            return (
              <NavLink
                key={notebook.id}
                to={`/notebooks/${notebook.id}`}
                onClick={() => setShowForm(false)}
              >
                <div
                  className={
                    Number.parseInt(notebookId) === notebook.id
                      ? "notebook selected"
                      : "notebook"
                  }
                >
                  <div className="primary-text">{notebook.title}</div>
                  <div className="notebookInfo">
                    <div className="secondary-text">
                      {new Date(notebook.updatedAt).getMonth() + 1}/{new Date(notebook.updatedAt).getDate()}/{new Date(notebook.updatedAt).getFullYear()}
                    </div>
                    <div className="notebookImage" />
                  </div>
                </div>
              </NavLink>
            )
          }
          )}
        </nav>

        <FloatingButton
          hidden={showForm}
          onClick={() => setShowForm(true)}
        />

        {
          showForm ? (
            <NotebookForm
              hidden={!showForm}
              hideForm={() => setShowForm(false)} />
          ) : (
            <>
              <Route path="/notebooks/:notebookId">
                <NotebookDetail
                  hidden={!showForm}
                  setShowForm={() => setShowForm(false)}
                />
              </Route>
            </>
          )
        }
      </main>
    )
  }
}

export default NotesPage;
