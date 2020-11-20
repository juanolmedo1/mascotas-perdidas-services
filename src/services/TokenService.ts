import { Service } from "typedi";
import { getConnection } from "typeorm";
import { Token } from "@src/entity/Token";
import { CreateTokenInput } from "@src/resolvers/token/CreateTokenInput";

@Service()
export class TokenService {
  async getToken(accessToken: string): Promise<Token> {
    const token = await Token.findOne({ where: { token: accessToken } });
    if (!token) {
      throw new Error("Token not found");
    }
    return token;
  }

  async createToken(options: CreateTokenInput): Promise<Token> {
    return Token.create(options).save();
  }

  async deleteToken(token: string): Promise<Token> {
    const deletedToken = await Token.findOne({ where: { token } });
    if (!deletedToken) {
      throw new Error("Token not found.");
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where("token = :token", { token })
      .execute();

    return deletedToken;
  }

  async deleteTokensFromUser(userId: string): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where("userId = :userId", { userId })
      .execute();
  }
}
