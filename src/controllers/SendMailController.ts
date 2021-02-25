import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SuveysUserRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UsersRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await userRepository.findOne({ email });

    if (!userAlreadyExists) {
      return response.status(400).json({ error: "User does not exists" });
    }

    const survey = await surveyRepository.findOne({
      id: survey_id,
    });

    if (!survey) {
      return response.status(400).json({ error: "Survey does not exist" });
    }

    //save on table surveys_users
    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    //send email ...
    await SendMailService.execute(email, survey.title, survey.description);

    return response.json(surveyUser);
  }
}

export { SendMailController };
