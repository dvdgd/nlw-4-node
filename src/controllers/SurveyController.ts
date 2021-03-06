import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysReposytory = getCustomRepository(SurveysRepository);

    const survey = surveysReposytory.create({ title, description });

    await surveysReposytory.save(survey);

    return response.status(201).json(survey);
  }

  async show(resquest: Request, response: Response) {
    const surveyRepository = getCustomRepository(SurveysRepository);

    const all = await surveyRepository.find();

    return response.json(all);
  }
}

export { SurveysController };
