import { Service } from "typedi";
import { Arg } from "type-graphql";
import { CreateUserInput } from "@src/resolvers/user/CreateUserInput";
import { User } from "@src/entity/User";
import { UpdateUserInput } from "@src/resolvers/user/UpdateUserInput";
import { Publication } from "@src/entity/Publication";
import { CreateProfilePhotoInput } from "@src/resolvers/user/CreateProfilePhotoInput";
import { ProfilePhotoService } from "@src/services/ProfilePhotoService";

@Service()
export class UserService {
  constructor(private profilePhotoService: ProfilePhotoService) {}

  async create(
    @Arg("options", () => CreateUserInput)
    options: CreateUserInput
  ): Promise<User> {
    const {
      photo: { data, type }
    } = options;
    const newProfilePhoto: CreateProfilePhotoInput = {
      data,
      type
    };
    const { id } = await this.profilePhotoService.create(newProfilePhoto);
    return User.create({
      ...options,
      profilePictureId: id
    }).save();
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
