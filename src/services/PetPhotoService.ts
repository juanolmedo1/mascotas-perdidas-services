import { Service } from "typedi";
import { PetPhoto } from "@entity/PetPhoto";
import { CreatePetPhotoInput } from "@resolvers/pet/CreatePetPhotoInput";
import { Pet } from "@entity/Pet";

@Service()
export class PetPhotoService {
  async create(options: CreatePetPhotoInput): Promise<PetPhoto> {
    return PetPhoto.create(options).save();
  }

  async delete(id: string): Promise<PetPhoto> {
    const deletedPhoto = await PetPhoto.findOne(id);
    if (!deletedPhoto) throw new Error("Photo was not found.");
    await PetPhoto.delete(id);
    return deletedPhoto;
  }

  async getAll({ id }: Pet): Promise<PetPhoto[]> {
    return PetPhoto.find({ where: { petId: id } });
  }

  async getOne(id: string): Promise<PetPhoto | undefined> {
    return PetPhoto.findOne(id);
  }
}
