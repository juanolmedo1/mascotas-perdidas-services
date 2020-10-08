import {
  Resolver,
  FieldResolver,
  Root,
  ResolverInterface,
  Query,
  Arg,
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

@Service()
@Resolver(Pet)
export class PetResolver implements ResolverInterface<Pet> {
  constructor(
    private petPhotoService: PetPhotoService,
    private MLModelService: MLModelService
  ) {}

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
