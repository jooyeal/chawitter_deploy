import { dbService, storageService } from "fbinstance";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const ChaweetFactory = ({ userObj }) => {
  const [chaweet, setChaweet] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const onSubmit = async (event) => {
    if (chaweet === "") {
      return;
    }
    event.preventDefault();
    let downloadUrl = "";
    if (fileUrl !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(fileUrl, "data_url");
      downloadUrl = await response.ref.getDownloadURL();
    }
    const chaweetObj = {
      text: chaweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      downloadUrl,
    };
    await dbService.collection("chaweets").add(chaweetObj);
    setChaweet("");
    setFileUrl("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setChaweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const File = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFileUrl(result);
    };
    reader.readAsDataURL(File);
  };
  const onClearFile = () => setFileUrl("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={chaweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {fileUrl && (
        <div className="factoryForm__attachment">
          <img
            src={fileUrl}
            style={{
              backgroundImage: fileUrl,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearFile}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default ChaweetFactory;
