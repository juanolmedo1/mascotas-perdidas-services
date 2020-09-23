import { Service } from "typedi";
import { Arg } from "type-graphql";
import { CreatePetPhotoInput } from "@src/resolvers/pet/CreatePetPhotoInput";
import { PetPhotoService } from "@src/services/PetPhotoService";
import { Pet } from "@entity/Pet";
import { CreatePetInput } from "@src/resolvers/pet/CreatePetInput";
import { UpdatePetInput } from "@src/resolvers/pet/UpdatePetInput";

@Service()
export class PetService {
  constructor(private petPhotoService: PetPhotoService) {}

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
}
