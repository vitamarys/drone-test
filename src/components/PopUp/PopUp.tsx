import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { closePopup } from "../../store/actionCreators";
import { PlayerIdForm } from "../forms/PlayerIdForm/PlayerIdForm";

export const PopUp = () => {
  const type = useAppSelector((state) => state.popup.popUpContent);
  const dispatch = useAppDispatch();

  return (
    <div
      className="popup-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dispatch(closePopup());
        }
      }}
    >
      <div className="popup-body">
        {type === "form" && <PlayerIdForm />}
        {type === "fail" && <h3 className="pop-title fail">Fail</h3>}
        {type === "success" && <h3 className="pop-title success">success</h3>}
      </div>
    </div>
  );
};
