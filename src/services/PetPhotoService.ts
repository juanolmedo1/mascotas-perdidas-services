import { Service } from "typedi";
import { PetPhoto } from "@entity/PetPhoto";
import { CreatePetPhotoInput } from "@resolvers/pet/CreatePetPhotoInput";
import { Pet } from "@entity/Pet";
import { MediaService } from "@src/services/MediaService";

@Service()
export class PetPhotoService {
  constructor(private mediaService: MediaService) {}

  async create(options: CreatePetPhotoInput): Promise<PetPhoto> {
    const { url, public_id } = await this.mediaService.uploadPublicationImage(
      options
    );
    const newPetPhoto: CreatePetPhotoInput = {
      data: url,
      petId: options.petId,
      type: options.type,
      publicId: public_id,
    };
    return PetPhoto.create(newPetPhoto).save();
  }

  async deleteAll({ id }: Pet, keepPhotos: boolean): Promise<PetPhoto[]> {
    const photos = await PetPhoto.find({ where: { petId: id } });
    if (!photos || !photos.length) throw new Error("Photo was not found.");
    for (const photo of photos) {
      if (!keepPhotos) {
        await this.mediaService.deleteImage(photo.publicId);
      }
      await PetPhoto.delete(photo.id);
    }
    return photos;
  }

  async getPhotoByPetId(id: string): Promise<PetPhoto> {
    const petPhoto = await PetPhoto.findOne({ where: { petId: id } });
    if (!petPhoto) throw new Error("Pet photo not found");
    return petPhoto;
  }

  async getPhotosByPetId(id: string): Promise<PetPhoto[]> {
    const petPhoto = await PetPhoto.find({ where: { petId: id } });
    if (!petPhoto) throw new Error("Pet photo not found");
    return petPhoto;
  }

  async getAll({ id }: Pet): Promise<PetPhoto[]> {
    return PetPhoto.find({ where: { petId: id } });
  }

  async getOne(id: string): Promise<PetPhoto | undefined> {
    return PetPhoto.findOne(id);
  }
}
