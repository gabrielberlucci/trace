import { getUniqueStates } from "@/services";
import type { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const getStatesController = async (req: Request, res: Response) => {
  const data = await getUniqueStates();

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: "Estados resgatados com sucesso",
    data: data,
  });
};
