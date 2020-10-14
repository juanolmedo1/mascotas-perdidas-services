import {
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface,
  Query,
  Arg,
  Mutation,
} from "type-graphql";
import { Service } from "typedi";
import { PetPhoto } from "@src/entity/PetPhoto";
import { PetPhotoService } from "@src/services/PetPhotoService";
import { Pet } from "@entity/Pet";
import {
  ImagePrediction,
  ImagePredictionWithoutPhoto,
  MLModelService,
  TypeAndBreed,
} from "@src/services/MLModelService";
import { PetService } from "@src/services/PetService";
import { CommonValues } from "@src/entity/CommonValues";

@Service()
@Resolver(Pet)
export class PetResolver implements ResolverInterface<Pet> {
  constructor(
    private petPhotoService: PetPhotoService,
    private MLModelService: MLModelService,
    private petService: PetService
  ) {}

  @Query(() => CommonValues)
  async getCommonValues(
    @Arg("breed", () => String) breed: string
  ): Promise<CommonValues> {
    return this.petService.getCommonValues(breed);
  }

  @Mutation(() => Boolean)
  async generateRandomCommonValues(): Promise<boolean> {
    await this.petService.generateRandomCommonValues();
    return true;
  }

  @Mutation(() => Boolean)
  async updateCommonValuesTable(): Promise<boolean> {
    await this.petService.updateCommonValuesTable();
    return true;
  }

  @Query(() => TypeAndBreed)
  async getTypeAndBreed(
    @Arg("image", () => String) image: string
  ): Promise<TypeAndBreed> {
    return this.MLModelService.getTypeAndBreed(image);
  }

  @Query(() => [ImagePredictionWithoutPhoto])
  async isCatOrDog(
    @Arg("image", () => String) image: string
  ): Promise<ImagePredictionWithoutPhoto[]> {
    return this.MLModelService.isCatOrDog(image);
  }

  @Query(() => [ImagePrediction])
  async getDogBreed(
    @Arg("image", () => String) image: string
  ): Promise<ImagePrediction[]> {
    return this.MLModelService.getDogBreed(image);
  }

  @Query(() => [ImagePrediction])
  async getCatBreed(
    @Arg("image", () => String) image: string
  ): Promise<ImagePrediction[]> {
    return this.MLModelService.getCatBreed(image);
  }

  @FieldResolver()
  async photos(@Root() pet: Pet): Promise<PetPhoto[]> {
    return this.petPhotoService.getAll(pet);
  }
}
