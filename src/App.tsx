import { useEffect } from "react";

import "./App.css";

import { PlayerIdForm } from "./components/forms/PlayerIdForm/PlayerIdForm";
import DroneMap from "./components/DroneMap/DroneMap";
import { useAppSelector } from "./hooks/useRedux";
import Score from "./components/Score/Score";
import { PopUp } from "./components/PopUp/PopUp";

function App() {
  const { tokenReady, gameStart } = useAppSelector((state) => state.playerId);
  const { isOpen } = useAppSelector((state) => state.popup);

  useEffect(() => {}, [tokenReady]);

  return (
    <div className="App">
      {isOpen && <PopUp />}

      <div className="container">
        {!gameStart && (
          <>
            <Score />
          </>
        )}
        {tokenReady && <DroneMap />}
      </div>
    </div>
  );
}

export default App;
