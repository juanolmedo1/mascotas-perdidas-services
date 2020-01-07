import { Service } from "typedi";
import { Arg } from "type-graphql";
import { CreateUserInput } from "@src/resolvers/user/CreateUserInput";
import { User } from "@src/entity/User";
import { UpdateUserInput } from "@src/resolvers/user/UpdateUserInput";
import { Publication } from "@src/entity/Publication";

@Service()
export class UserService {
  async create(
    @Arg("options", () => CreateUserInput)
    options: CreateUserInput
  ): Promise<User> {
    return User.create(options).save();
  }

  async delete(@Arg("id", () => String) id: string): Promise<User> {
    const deletedUser = await User.findOne(id);
    if (!deletedUser) throw new Error("User was not found.");
    await User.delete(id);
    return deletedUser;
  }

  async update(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput
  ): Promise<User> {
    await User.update(id, input);
    const updatedUser = await User.findOne(id);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }

  async getAll(): Promise<User[]> {
    return User.find();
  }

  async getOne(@Arg("id", () => String) id: string): Promise<User | undefined> {
    return User.findOne(id);
  }

  async getCreator({ creatorId }: Publication): Promise<User> {
    const creator = await User.findOne(creatorId);
    if (!creator) throw new Error("Creator not found.");
    return creator;
  }
}
