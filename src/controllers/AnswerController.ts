import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SuveysUserRepository";

class AnswerController {
  /** http://localhost:3333/anwsers/1?u=70a99dfe-f8e3-4daa-82dd-eb3e977a52d4
   *  Route Params => Parametros que compõem a rota
   * routes.get("/anwser/:value")
   *
   * Query Params => busca, paginação, não obrigatórios
   * ?
   * chave=valor
   **/
  async execute(request: Request, response: Response) {
    const { value } = request.params; //getting note of user request
    const { u } = request.query; //getting user_id

    console.log(value, u);

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      throw new AppError("Survey User does not exist!");
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }
}

export { AnswerController };
