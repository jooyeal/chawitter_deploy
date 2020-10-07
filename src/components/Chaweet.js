import { dbService, storageService } from "fbinstance";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Chaweet = ({ chaweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newChaweet, setNewChaweet] = useState(chaweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure want to delete?");
    if (ok) {
      await dbService.doc(`chaweets/${chaweetObj.id}`).delete();
      await storageService.refFromURL(chaweetObj.downloadUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`chaweets/${chaweetObj.id}`).update({
      text: newChaweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewChaweet(value);
  };
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              placeholder="Edit your chaweet"
              value={newChaweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Chaweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{chaweetObj.text}</h4>

          {chaweetObj.downloadUrl && <img src={chaweetObj.downloadUrl} />}

          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chaweet;
