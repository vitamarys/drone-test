import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useRedux";
import { closePopup, openPop } from "../../store/actionCreators";
interface PlayerData {
  name: string;
  complexity: string;
  score: number;
}
const Score: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const scoreStore = localStorage.getItem("scores");
    if (scoreStore) {
      const arr = JSON.parse(scoreStore);
      setPlayerData(arr);
    }
  }, []);
  const openPopUp = () => {
  
    dispatch(openPop("form"));
  };
  return (
    <div className="score-wpar">
      <h2>Score</h2>
      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Difficulty Level</th>
            <th>Final Score</th>
          </tr>
        </thead>
        <tbody>
     
        {playerData.map((player, index) => (
            <tr key={index}>
              <td>{player.name}</td>
              <td>{player.complexity}</td>
              <td>{player.score.toFixed(2)}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
      <button className="start-btn" onClick={openPopUp}>
        Start game
      </button>
    </div>
  );
};

export default Score;
