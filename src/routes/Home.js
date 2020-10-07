import { dbService } from "fbinstance";
import React, { useEffect, useState } from "react";
import Chaweet from "components/Chaweet";
import ChaweetFactory from "components/ChaweetFactory";

const Home = ({ userObj }) => {
  const [chaweets, setChaweets] = useState([]);

  useEffect(() => {
    dbService.collection("chaweets").onSnapshot((snapshot) => {
      const chaweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChaweets(chaweetArray);
    });
  }, []);

  return (
    <div className="container">
      <ChaweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {chaweets.map((chaweet) => (
          <Chaweet
            key={chaweet.id}
            chaweetObj={chaweet}
            isOwner={chaweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
