import { Service } from "typedi";
import * as AutoML from "@tensorflow/tfjs-automl";
import * as TFNode from "@tensorflow/tfjs-node";
import { Field, ObjectType } from "type-graphql";
import { MediaService } from "@src/services/MediaService";
import fs from "fs";
import DogTranslations from "@src/translations/dogs";
import CatTranslations from "@src/translations/cats";

@ObjectType()
export class ImagePredictionWithoutPhoto {
  @Field()
  label: string;

  @Field()
  prob: number;
}

@ObjectType()
export class ImagePrediction {
  @Field()
  label: string;

  @Field()
  labelSpanish: string;

  @Field()
  prob: number;

  @Field()
  photo: string;
}

@ObjectType()
export class TypeAndBreed {
  @Field()
  type: string;

  @Field(() => [ImagePrediction])
  breed: ImagePrediction[];
}

@Service()
export class MLModelService {
  private DOG_BREEDS_MODEL = process.env.DOG_BREEDS_MODEL!;
  private DOG_BREEDS_DICT = process.env.DOG_BREEDS_DICT!;
  private CAT_BREEDS_MODEL = process.env.CAT_BREEDS_MODEL!;
  private CAT_BREEDS_DICT = process.env.CAT_BREEDS_DICT!;
  private CAT_VS_DOG_MODEL = process.env.CAT_VS_DOG_MODEL!;
  private CAT_VS_DOG_DICT = process.env.CAT_VS_DOG_DICT!;

  constructor(private mediaService: MediaService) {}

  private loadDictionary(dictURL: string): string[] {
    const text = fs.readFileSync(dictURL, {
      encoding: "utf-8",
    });
    return text.trim().replace(/(\r)/gm, "").split("\n");
  }

  private async initModel(
    modelURL: string,
    dictURL: string
  ): Promise<AutoML.ImageClassificationModel> {
    const [model, dict] = await Promise.all([
      TFNode.loadGraphModel(modelURL),
      this.loadDictionary(dictURL),
    ]);
    return new AutoML.ImageClassificationModel(model, dict);
  }

  async getTypeAndBreed(base64Image: string): Promise<TypeAndBreed> {
    const catOrDog = await this.isCatOrDog(base64Image);
    const type = catOrDog[0].label;
    let response: TypeAndBreed = {
      type,
      breed: [],
    };
    if (type === "dog") {
      const dogBreed = await this.getDogBreed(base64Image);
      response.breed = dogBreed;
    } else {
      if (type === "cat") {
        const catBreed = await this.getCatBreed(base64Image);
        response.breed = catBreed;
      } else {
        response.type = "other";
      }
    }
    return response;
  }

  async isCatOrDog(
    base64Image: string
  ): Promise<ImagePredictionWithoutPhoto[]> {
    const catDogModel = await this.initModel(
      this.CAT_VS_DOG_MODEL,
      this.CAT_VS_DOG_DICT
    );
    const buffer = Buffer.from(base64Image, "base64");
    const petPhoto = TFNode.node.decodeImage(buffer, 3);
    const predictions = await catDogModel.classify(petPhoto as TFNode.Tensor3D);
    const sortedPredictions = predictions.sort((petA, petB) => {
      if (petA.prob > petB.prob) return -1;
      if (petA.prob < petB.prob) return 1;
      return 0;
    });
    const catOrDogNotDetected = sortedPredictions[0].prob < 0.8;
    if (catOrDogNotDetected) {
      const notFoundObject: ImagePredictionWithoutPhoto = {
        label: "other",
        prob: sortedPredictions[0].prob,
      };
      return [notFoundObject];
    }
    return sortedPredictions;
  }

  async getDogBreed(base64Image: string): Promise<ImagePrediction[]> {
    const dogBreedModel = await this.initModel(
      this.DOG_BREEDS_MODEL,
      this.DOG_BREEDS_DICT
    );
    const buffer = Buffer.from(base64Image, "base64");
    const petPhoto = TFNode.node.decodeImage(buffer, 3);
    const predictions = await dogBreedModel.classify(
      petPhoto as TFNode.Tensor3D
    );
    const sortedPredictions = predictions
      .sort((petA, petB) => {
        if (petA.prob > petB.prob) return -1;
        if (petA.prob < petB.prob) return 1;
        return 0;
      })
      .slice(0, 3);
    let response: ImagePrediction[] = [];
    for (let prediction of sortedPredictions) {
      const translateObject = DogTranslations.find(
        ({ english }) => english === prediction.label
      );
      let newPrediction: ImagePrediction = {
        ...prediction,
        labelSpanish: translateObject!.spanish,
        photo: "",
      };
      const photo = await this.mediaService.getPhotosByTag(prediction.label);
      newPrediction.photo = photo.resources[0].url;
      response.push(newPrediction);
    }

    return response;
  }

  async getCatBreed(base64Image: string): Promise<ImagePrediction[]> {
    const catBreedModel = await this.initModel(
      this.CAT_BREEDS_MODEL,
      this.CAT_BREEDS_DICT
    );
    const buffer = Buffer.from(base64Image, "base64");
    const petPhoto = TFNode.node.decodeImage(buffer, 3);
    const predictions = await catBreedModel.classify(
      petPhoto as TFNode.Tensor3D
    );
    const sortedPredictions = predictions
      .sort((petA, petB) => {
        if (petA.prob > petB.prob) return -1;
        if (petA.prob < petB.prob) return 1;
        return 0;
      })
      .slice(0, 3);
    let response: ImagePrediction[] = [];
    for (let prediction of sortedPredictions) {
      const translateObject = CatTranslations.find(
        ({ english }) => english === prediction.label
      );
      let newPrediction: ImagePrediction = {
        ...prediction,
        labelSpanish: translateObject!.spanish,
        photo: "",
      };
      const photo = await this.mediaService.getPhotosByTag(prediction.label);
      newPrediction.photo = photo.resources[0].url;
      response.push(newPrediction);
    }

    return response;
  }
}
