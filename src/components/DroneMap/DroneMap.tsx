import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import useWebSocket from "react-use-websocket";
import { IPlayerInfo } from "../../types/types";
import { gameStatus, openPop, removeToken } from "../../store/actionCreators";

const DroneMap = () => {
  const { playerId, userInfo } = useAppSelector((state) => state.playerId);
  const { token } = useAppSelector((state) => state.token);
  const complexity = userInfo?.complexity || 0;
  const [arr, setArr] = useState<string[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [x, setX] = useState(250);
  const [y, setY] = useState(5);
  const [speedX, setSpeedX] = useState(0);
  const [speedY, setSpeedY] = useState(0);
  const [crash, setCrash] = useState(false);
  const [cavePosition, setCavePosition] = useState(0);
  const [sorce, setSorce] = useState(0);
  const size = 10;
  const stoge = localStorage.getItem("scores");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          if (speedY > 0) {
            setSpeedY((prevSpeedY) => prevSpeedY - 0.2);
          }
          setIsMoving(true); // Встановлюємо isMoving в true при натисканні кнопки
          break;
        case "ArrowDown":
          event.preventDefault();
          setSpeedY((prevSpeedY) => prevSpeedY + 0.2);
          setIsMoving(true); // Встановлюємо isMoving в true при натисканні кнопки
          break;
        case "ArrowLeft":
          event.preventDefault();
          setSpeedX((prevSpeedX) => prevSpeedX - 0.2);
          setIsMoving(true); // Встановлюємо isMoving в true при натисканні кнопки
          break;
        case "ArrowRight":
          event.preventDefault();
          setSpeedX((prevSpeedX) => prevSpeedX + 0.2);
          setIsMoving(true); // Встановлюємо isMoving в true при натисканні кнопки
          break;
        default:
          break;
      }
    };

    const moveDrone = () => {
      setX((prevX) => prevX + speedX);
      setY((prevY) => prevY + speedY);
      collision();
    };

    const moveCave = () => {
      setCavePosition((prevPosition) => prevPosition + speedY); // Зсув печери по вертикалі
    };
    const moveInterval = setInterval(() => {
      if (isMoving) {
        moveDrone();
        moveCave();
        setSorce(y * (speedY + complexity));
      }
    }, 100); // Інтервал для плавного руху та печери, і трикутника
    if (crash) {
      clearInterval(moveInterval);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(moveInterval);
    };
  }, [speedX, speedY, x, y]);

  const setData = (user: IPlayerInfo, score: number) => {
    if (stoge) {
      let playerDataFromStorage:
        | { name: string; complexity: number; score: number }[]
        | null = JSON.parse(stoge);

      if (Array.isArray(playerDataFromStorage)) {
        playerDataFromStorage.push({
          name: user.name,
          complexity: user.complexity,
          score: score,
        });
        let updatedJsonString = JSON.stringify(playerDataFromStorage);
        localStorage.setItem("scores", updatedJsonString);
      } else {
        localStorage.setItem(
          "scores",
          JSON.stringify([
            { name: user.name, complexity: user.complexity, score: score },
          ])
        );
      }
    } else {
      localStorage.setItem(
        "scores",
        JSON.stringify([
          { name: user.name, complexity: user.complexity, score: score },
        ])
      );
    }
  };
  const drawTriangle = () => {
    return (
      <polygon
        points={`${x},${y + size / 2} ${x + size / 2},${y - size / 2} ${
          x - size / 2
        },${y - size / 2}`}
        fill="blue"
      />
    );
  };

  const drawCave = () => {
    if (arr.length < 2) return null;

    const centerX = 250;
    const lines = arr.map((coordinate, index) => {
      const [x, y] = coordinate.split(",").map(Number);
      const pointOneX = centerX - Math.abs(x);
      const pointTwoX = centerX + Math.abs(y);
      const pointY = index - speedY;

      if (index === 0) {
        return null;
      }

      const prevCoordinate = arr[index - 1];
      const [prevX, prevY] = prevCoordinate.split(",").map(Number);
      const prevPointOneX = centerX - Math.abs(prevX);
      const prevPointTwoX = centerX + Math.abs(prevY);
      const prevPointY = index - 1 - speedY; 

      return (
        <g key={index}>
          <path
            d={`M${prevPointOneX},${prevPointY} C${prevPointOneX},${prevPointY} ${pointOneX},${pointY} ${pointOneX},${pointY}`}
            stroke="gray"
            strokeWidth="2"
            fill="none"
          />
          <path
            d={`M${prevPointTwoX},${prevPointY} C${prevPointTwoX},${prevPointY} ${pointTwoX},${pointY} ${pointTwoX},${pointY}`}
            stroke="gray"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="0"
            y1={pointY}
            x2={pointOneX}
            y2={pointY}
            stroke="gray"
            strokeWidth="2"
          />
          <line
            x1={pointTwoX}
            y1={pointY}
            x2="500"
            y2={pointY}
            stroke="gray"
            strokeWidth="2"
          />
        </g>
      );
    });

    return lines;
  };
  const collision = () => {
    const leftTopX = x - 5;
    const rightTopX = x + 5;
    const topY = y - 5;
    const botY = y + 5;
    const botX = x;

    if (botY >= arr.length) {
      if (userInfo) setData(userInfo, sorce);
      dispatch(openPop("success"));
      dispatch(removeToken());
      dispatch(gameStatus(false));
    }
    arr.map((coordinate, index) => {
      const [x, y] = coordinate.split(",").map(Number);
      if (leftTopX <= 250 - Math.abs(x) && index === +topY.toFixed(0)) {
        dispatch(openPop("fail"));
        dispatch(removeToken());
        dispatch(gameStatus(false));
        setCrash(true);
      }
      if (rightTopX >= 250 + Math.abs(y) && index === +topY.toFixed(0)) {
        dispatch(openPop("fail"));
        dispatch(removeToken());
        dispatch(gameStatus(false));
        setCrash(true);
      }
      if (botX <= 250 - Math.abs(x) && +botY.toFixed(0) === index) {
        dispatch(openPop("fail"));
        dispatch(removeToken());
        dispatch(gameStatus(false));
        setCrash(true);
      }
      if (botX >= 250 + Math.abs(y) && +botY.toFixed(0) === index) {
        dispatch(openPop("fail"));
        dispatch(removeToken());
        dispatch(gameStatus(false));
        setCrash(true);
      }
    });
  };

  const firstMessage = `player:${playerId}-${token}`;
  const url = "wss://cave-drone-server.shtoa.xyz/cave";
  const { sendMessage } = useWebSocket(url, {
    onOpen: () => {
      sendMessage(firstMessage);
      console.log("WebSocket connected!");
    },
    onMessage: (event: WebSocketEventMap["message"]) => {
      const data = event.data;
      if (data === "finished") {
        return;
      }
      if (data === "Player not found") {
        return;
      }

      setArr((prevArr) => [...prevArr, data]);
    },
    shouldReconnect: (closeEvent: CloseEvent) => {
      return false;
    },
  });

  return (
    <div className="map-wrap">
      {arr.length > 300 ? (
        <>
          <div className="canvas-container">
            <svg
              ref={svgRef}
              width="500"
              height="1000"
              style={{
                transform: `translateY(-${cavePosition}px)`,
              }}
            >
              {drawCave()}
              {drawTriangle()}
            </svg>
          </div>
          <p className="total">Score: {sorce.toFixed(2)}</p>

          <div className="settings">
            <p>
              Horisontal: <span>{speedX.toFixed(2)}</span>
            </p>
            <p>
              Vertical: <span>{speedY.toFixed(2)}</span>
            </p>
          </div>

          <div></div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DroneMap;
