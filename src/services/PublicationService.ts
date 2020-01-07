import { Service } from "typedi";
import { Publication } from "@src/entity/Publication";
import { Arg } from "type-graphql";
import { CreatePublicationInput } from "@src/resolvers/publication/CreatePublicationInput";
import { UpdatePublicationInput } from "@src/resolvers/publication/UpdatePublicationInput";
import { FilterPublicationsInput } from "@src/resolvers/publication/FilterPublicationsInput";
import { Not, getManager } from "typeorm";
import { User } from "@src/entity/User";
import { CreatePhotoInput } from "@src/resolvers/publication/CreatePhotoInput";
import { PhotoService } from "./PhotoService";

@Service()
export class PublicationService {
  constructor(private photoService: PhotoService) {}

  async create(
    @Arg("options", () => CreatePublicationInput)
    options: CreatePublicationInput
  ): Promise<Publication[]> {
    const { id } = await Publication.create(options).save();
    const { photosData } = options;
    for (const data of photosData) {
      const newPhoto: CreatePhotoInput = {
        data,
        publicationId: id
      };

      await this.photoService.create(newPhoto);
    }

    return this.getMatchings(id);
  }

  async delete(@Arg("id", () => String) id: string): Promise<Publication> {
    const deletedPublication = await Publication.findOne(id);
    if (!deletedPublication) throw new Error("Publication not found.");
    await Publication.delete(id);
    return deletedPublication;
  }

  async getAll(): Promise<Publication[]> {
    return Publication.find();
  }

  async update(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdatePublicationInput) input: UpdatePublicationInput
  ): Promise<Publication> {
    await Publication.update({ id }, input);
    const updatedPublication = await Publication.findOne(id);
    if (!updatedPublication) throw new Error("Publication not found.");
    return updatedPublication;
  }

  async getFiltered(
    @Arg("options", () => FilterPublicationsInput)
    options: FilterPublicationsInput
  ): Promise<Publication[]> {
    return Publication.find({ where: options });
  }

  async getOne(
    @Arg("id", () => String) id: string
  ): Promise<Publication | undefined> {
    return Publication.findOne(id);
  }

  async getMatchings(
    @Arg("publicationId", () => String)
    publicationId: string
  ): Promise<Publication[]> {
    const publication = await Publication.findOne(publicationId);
    if (!publication) throw new Error("Publication was not found.");
    const { id, pet, petGender, type } = publication;
    return Publication.find({ where: { pet, type, petGender, id: Not(id) } });
  }

  async getUserPublications({ id }: User): Promise<Publication[]> {
    return Publication.find({ where: { creatorId: id } });
  }

  async addComplaint(
    @Arg("id", () => String) id: string
  ): Promise<Publication> {
    const entityManager = getManager();
    const publication = await entityManager.findOne(Publication, id);
    if (!publication) throw new Error("Publication was not found.");
    publication.complaints = publication.complaints + 1;
    if (publication.complaints > 5) {
      // notificar administradores
    }
    return entityManager.save(publication);
  }
}
