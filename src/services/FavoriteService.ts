import { Service } from "typedi";
import { getConnection } from "typeorm";
import { Arg } from "type-graphql";
import { Favorite } from "@src/entity/Favorite";
import { CreateUserFavoritePublication } from "@src/resolvers/publication/CreateUserFavoritePublication";
import { DeleteUserFavoritePublication } from "@src/resolvers/publication/DeleteUserFavoritePublication";

@Service()
export class FavoriteService {
  async create(
    @Arg("options", () => CreateUserFavoritePublication)
    options: CreateUserFavoritePublication
  ): Promise<Favorite> {
    return Favorite.create(options).save();
  }

  async deleteByPublication(
    @Arg("publicationId", () => String)
    publicationId: string
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Favorite)
      .where("publicationId = :publicationId", { publicationId })
      .execute();
  }

  async delete(
    @Arg("options", () => DeleteUserFavoritePublication)
    options: DeleteUserFavoritePublication
  ): Promise<Favorite> {
    const favorite = await Favorite.findOne({
      where: options,
    });
    if (!favorite) {
      throw new Error("Favorito no encontrado.");
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Favorite)
      .where("userId = :userId AND publicationId = :publicationId", options)
      .execute();
    return favorite;
  }
}
