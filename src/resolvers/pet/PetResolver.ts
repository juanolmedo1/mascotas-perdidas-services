import { Resolver, FieldResolver, Root, ResolverInterface } from "type-graphql";
import { Service } from "typedi";
import { PetPhoto } from "@src/entity/PetPhoto";
import { PetPhotoService } from "@src/services/PetPhotoService";
import { Pet } from "@entity/Pet";

@Service()
@Resolver(Pet)
export class PetResolver implements ResolverInterface<Pet> {
  constructor(private petPhotoService: PetPhotoService) {}

  @FieldResolver()
  async photos(@Root() pet: Pet): Promise<PetPhoto[]> {
    return this.petPhotoService.getAll(pet);
  }
}
