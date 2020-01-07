import { Service } from "typedi";
import { Publication } from "@src/entity/Publication";
import { Photo } from "@src/entity/Photo";
import { CreatePhotoInput } from "@src/resolvers/publication/CreatePhotoInput";

@Service()
export class PhotoService {
  async create(options: CreatePhotoInput): Promise<Photo> {
    return Photo.create(options).save();
  }

  async delete(id: string): Promise<Photo> {
    const deletedPhoto = await Photo.findOne(id);
    if (!deletedPhoto) throw new Error("Photo was not found.");
    await Photo.delete(id);
    return deletedPhoto;
  }

  async getAll({ id }: Publication): Promise<Photo[]> {
    return Photo.find({ where: { publicationId: id } });
  }

  async getOne(id: string): Promise<Photo | undefined> {
    return Photo.findOne(id);
  }
}
