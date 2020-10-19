import { Service } from "typedi";
import { Arg } from "type-graphql";
import { CreateUserInput } from "@src/resolvers/user/CreateUserInput";
import { User } from "@src/entity/User";
import { UpdateUserInput } from "@src/resolvers/user/UpdateUserInput";
import { Publication } from "@src/entity/Publication";
import { CreateProfilePhotoInput } from "@src/resolvers/user/CreateProfilePhotoInput";
import { ProfilePhotoService } from "@src/services/ProfilePhotoService";
import { LoginInput } from "@src/resolvers/user/LoginInput";
import { ErrorMessages } from "@src/types/ErrorMessages";
import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server-core";
import { PublicationService } from "@src/services/PublicationService";
import { UbicationService } from "@src/services/UbicationService";

@Service()
export class UserService {
  constructor(
    private profilePhotoService: ProfilePhotoService,
    private publicationService: PublicationService,
    private ubicationService: UbicationService
  ) {}

  async login(
    @Arg("options", () => LoginInput)
    options: LoginInput
  ): Promise<User> {
    const { username, password } = options;
    const user = await this.checkLogin(username);
    if (!user) {
      throw new UserInputError(ErrorMessages.INVALID_USERNAME, {
        invalidArg: "username",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UserInputError(ErrorMessages.INVALID_PASSWORD, {
        invalidArg: "password",
      });
    }

    return user;
  }

  async create(
    @Arg("options", () => CreateUserInput)
    options: CreateUserInput
  ): Promise<User> {
    const {
      photo: { data, type },
      ubicationData: { latitude, longitude },
      password,
      email,
      username,
    } = options;
    const emailExist = await this.getByEmail(email);
    if (emailExist) {
      throw new UserInputError(ErrorMessages.EMAIL_EXIST, {
        invalidArg: "email",
      });
    }
    const usernameExist = await this.getByUsername(username);
    if (usernameExist) {
      throw new UserInputError(ErrorMessages.USERNAME_EXIST, {
        invalidArg: "username",
      });
    }
    const userUbication = await this.ubicationService.create(
      latitude,
      longitude
    );
    const newProfilePhoto: CreateProfilePhotoInput = {
      data,
      type,
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const { id } = await this.profilePhotoService.create(newProfilePhoto);
    return User.create({
      ...options,
      ubicationId: userUbication.id,
      profilePictureId: id,
      password: hashedPassword,
    }).save();
  }

  async delete(@Arg("id", () => String) id: string): Promise<User> {
    const deletedUser = await User.findOne(id);
    if (!deletedUser) {
      throw new UserInputError(ErrorMessages.USER_NOT_FOUND);
    }
    await this.publicationService.deleteAllFromUser(deletedUser);
    await User.delete(id);
    await this.profilePhotoService.delete(deletedUser.profilePictureId);
    await this.ubicationService.delete(deletedUser.ubicationId);
    return deletedUser;
  }

  async update(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput
  ): Promise<User> {
    const { ubicationData, ...others } = input;
    if (Object.keys(others).length) {
      await User.update(id, others);
    }
    const updatedUser = await User.findOne(id);
    if (!updatedUser) {
      throw new UserInputError(ErrorMessages.USER_NOT_FOUND);
    }
    if (ubicationData) {
      await this.ubicationService.updateCurrentUbication(
        updatedUser.ubicationId,
        ubicationData
      );
    }

    return updatedUser;
  }

  async getAll(): Promise<User[]> {
    return User.find();
  }

  async getOne(@Arg("id", () => String) id: string): Promise<User> {
    const user = await User.findOne(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async checkLogin(
    @Arg("username", () => String) username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: [{ username }, { email: username }] });
  }

  async getByUsername(
    @Arg("username", () => String) username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }

  async getByEmail(
    @Arg("email", () => String) email: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { email } });
  }

  async getCreator({ creatorId }: Publication): Promise<User> {
    const creator = await User.findOne(creatorId);
    if (!creator) throw new UserInputError(ErrorMessages.USER_NOT_FOUND);
    return creator;
  }
}
