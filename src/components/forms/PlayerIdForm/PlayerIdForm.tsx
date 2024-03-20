import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IPlayerInfo } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  closePopup,
  fetchPlayerId,
  fetchToken,
} from "../../../store/actionCreators";

const playerIdSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  complexity: z
    .number()
    .min(1, { message: "Must be from 1 to 10" })
    .max(10, { message: "Must be from 1 to 10" }),
});
type playerIdSchemaType = z.infer<typeof playerIdSchema>;

export const PlayerIdForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<playerIdSchemaType>({
    resolver: zodResolver(playerIdSchema),
  });
  const onSubmit = handleSubmit(async (data: IPlayerInfo) => {
    try {
      dispatch(closePopup());
      const id = await dispatch(fetchPlayerId(data));
      await dispatch(fetchToken(id));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });

  return (
    <div className="form-wrap">
      <h1>Enter your name and complexity</h1>
      <form onSubmit={onSubmit} className="form">
        <input placeholder="Name" type="text" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
        <input
          type="number"
          placeholder="Complexity from 1 to 10"
          {...register("complexity", { valueAsNumber: true })}
        />
        {errors.complexity && <p>{errors.complexity.message}</p>}

        <input type="submit" value="Start" />
      </form>
    </div>
  );
};
