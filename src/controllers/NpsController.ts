import { getCustomRepository, Not, IsNull } from "typeorm";
import { Request, Response } from "express";
import { SurveysUsersRepository } from "../repositories/SuveysUserRepository";

class NpsController {
  /**
   * 1 2 3 4 5 6 7 8 9 10
   * Detractors => 0 - 6
   * Passives => 7 - 8
   * Promoters => 9 - 10
   */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passives = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveyUsers.length;

    const calculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractor,
      passives,
      promoters,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };
