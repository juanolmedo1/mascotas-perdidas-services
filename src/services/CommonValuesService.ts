import { Service } from "typedi";
import { Arg } from "type-graphql";
import { CreateCommonValueInput } from "@src/resolvers/commonValues/CreateCommonValueInput";
import { CommonValues } from "@src/entity/CommonValues";
import { UpdateCommonValueInput } from "@src/resolvers/commonValues/UpdateCommonValueInput";
import CatBreeds from '@src/translations/cats';
import DogBreeds from '@src/translations/dogs';
import { PetGender, PetSize } from "@src/entity/Pet";

@Service()
export class CommonValuesService {
  async create(
    @Arg("options", () => CreateCommonValueInput)
    options: CreateCommonValueInput
  ): Promise<CommonValues> {
    return CommonValues.create(options).save();
  }

  async update(
    @Arg("options", () => UpdateCommonValueInput)
    options: UpdateCommonValueInput
  ): Promise<CommonValues> {
    await CommonValues.update({ breed: options.breed }, options);
    const updatedValue = await CommonValues.findOne(options.breed);
    if (!updatedValue) {
      throw new Error('CommonValue not found');
    }
    return updatedValue;
  }
  async getOne(@Arg("breed", () => String)
  breed: string): Promise<CommonValues> {
    const commonValue = await CommonValues.findOne(breed);
    if (!commonValue) throw new Error("CommonValue not found");
    return commonValue;
  }

  async generateRandomValues(): Promise<void> {
    const sizeArray = ["VERY_SMALL","SMALL","MEDIUM","LARGE"];
    const genderArray = ["MALE","FEMALE"];
    const colorArray = ['#000000','#404040','#808080','#c0c0c0','#ffffff','#392613','#a06a34','#ce9b69','#fff8dc','#f7c66b'];
    for (let breed of DogBreeds) {
      const randomSize = sizeArray[Math.floor(Math.random() * sizeArray.length)];
      const randomGender = genderArray[Math.floor(Math.random() * genderArray.length)];
      const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
      const newValue : CreateCommonValueInput = {
        breed: breed.english,
        size: randomSize as PetSize,
        color: randomColor,
        gender: randomGender as PetGender
      }
      await this.create(newValue);
    }
    for (let breed of CatBreeds) {
      const randomGender = genderArray[Math.floor(Math.random() * genderArray.length)];
      const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
      const newValue : CreateCommonValueInput = {
        breed: breed.english,
        size: PetSize.MEDIUM,
        color: randomColor,
        gender: randomGender as PetGender
      }
      await this.create(newValue);
    }
  }
}
