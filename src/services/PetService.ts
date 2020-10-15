import { Service } from "typedi";
import { Arg } from "type-graphql";
import { CreatePetPhotoInput } from "@src/resolvers/pet/CreatePetPhotoInput";
import { PetPhotoService } from "@src/services/PetPhotoService";
import { Pet } from "@entity/Pet";
import { CreatePetInput } from "@src/resolvers/pet/CreatePetInput";
import { UpdatePetInput } from "@src/resolvers/pet/UpdatePetInput";
import { CommonValuesService } from "@src/services/CommonValuesService";
import DogBreeds from '@src/translations/dogs';
import CatBreeds from '@src/translations/cats';
import { UpdateCommonValueInput } from "@src/resolvers/commonValues/UpdateCommonValueInput";
import { CommonValues } from "@src/entity/CommonValues";

@Service()
export class PetService {
  constructor(private petPhotoService: PetPhotoService, private commonValuesService: CommonValuesService) {}

  async create(
    @Arg("options", () => CreatePetInput) options: CreatePetInput
  ): Promise<Pet> {
    const pet = await Pet.create(options).save();
    const { id } = pet;
    const { photosData } = options;
    for (const photo of photosData) {
      const newPhoto: CreatePetPhotoInput = {
        data: photo.data,
        type: photo.type,
        petId: id,
      };

      await this.petPhotoService.create(newPhoto);
    }

    return pet;
  }

  async delete(@Arg("id", () => String) id: string): Promise<Pet> {
    const deletedPet = await Pet.findOne(id);
    if (!deletedPet) throw new Error("Pet not found.");
    await this.petPhotoService.deleteAll(deletedPet);
    await Pet.delete(id);
    return deletedPet;
  }

  async getAll(): Promise<Pet[]> {
    return Pet.find();
  }

  async update(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdatePetInput) input: UpdatePetInput
  ): Promise<Pet> {
    await Pet.update({ id }, input);
    const updatedPet = await Pet.findOne(id);
    if (!updatedPet) throw new Error("Pet not found.");
    return updatedPet;
  }

  async getOne(@Arg("id", () => String) id: string): Promise<Pet> {
    const pet = await Pet.findOne(id);
    if (!pet) throw new Error("Pet not found.");
    return pet;
  }

  async getCommonValues(@Arg("breed", () => String) breed: string) : Promise<CommonValues> {
    return this.commonValuesService.getOne(breed);
  }

  async generateRandomCommonValues() : Promise<void> {
    return this.commonValuesService.generateRandomValues();
  }
  

  async updateCommonValuesTable(): Promise<void> {
    const allBreeds = [...DogBreeds, ...CatBreeds];
    for (let object of allBreeds) {
      const breed = object.english;
      const genderResult = await Pet.createQueryBuilder("pet")
        .select("pet.gender")
        .addSelect("COUNT(pet.gender)")
        .where('pet.breed = :breed', { breed })
        .groupBy("pet.gender")
        .getRawMany();
      if(!genderResult.length) {
        continue;
      }
      const maxGenderObject = genderResult.reduce((prev, current) => parseInt(prev.count) > parseInt(current.count) ? prev : current, 0);
      const maxGenderValue = maxGenderObject.pet_gender;
      const sizeResult = await Pet.createQueryBuilder("pet")
        .select("pet.size")
        .addSelect("COUNT(pet.size)")
        .where('pet.breed = :breed', { breed })
        .groupBy("pet.size")
        .getRawMany();
      const maxSizeObject = sizeResult.reduce((prev, current) => parseInt(prev.count) > parseInt(current.count) ? prev : current, 0);
      const maxSizeValue = maxSizeObject.pet_size;
      const colorResult = await Pet.createQueryBuilder("pet")
        .select("pet.color")
        .addSelect("COUNT(pet.color)")
        .where('pet.breed = :breed', { breed })
        .groupBy("pet.color")
        .getRawMany();
      const maxColorObject = colorResult.reduce((prev, current) => parseInt(prev.count) > parseInt(current.count) ? prev : current, 0);
      const maxColorValue = maxColorObject.pet_color;
      const newCommonValue: UpdateCommonValueInput = {
        breed,
        gender: maxGenderValue,
        color: maxColorValue,
        size: maxSizeValue
      }
      await this.commonValuesService.update(newCommonValue);
    }
  }
}
