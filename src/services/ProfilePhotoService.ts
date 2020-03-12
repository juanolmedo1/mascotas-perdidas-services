import { Service } from "typedi";
import { ProfilePhoto } from "@src/entity/ProfilePhoto";
import { CreateProfilePhotoInput } from "@src/resolvers/user/CreateProfilePhotoInput";
import { User } from "@src/entity/User";

@Service()
export class ProfilePhotoService {
  async create(options: CreateProfilePhotoInput): Promise<ProfilePhoto> {
    return ProfilePhoto.create(options).save();
  }

  async delete(id: string): Promise<ProfilePhoto> {
    const deletedProfilePhoto = await ProfilePhoto.findOne(id);
    if (!deletedProfilePhoto) throw new Error("Photo was not found.");
    await ProfilePhoto.delete(id);
    return deletedProfilePhoto;
  }

  async getFromUser({ id }: User): Promise<ProfilePhoto> {
    const profilePictureArray = await ProfilePhoto.find({
      where: { userId: id }
    });
    if (!profilePictureArray.length) {
      throw new Error("Profile picture was not found.");
    }
    return profilePictureArray[0];
  }

  async getOne(id: string): Promise<ProfilePhoto> {
    const photo = await ProfilePhoto.findOne(id);
    if (!photo) throw new Error("Profile photo not found.");
    return photo;
  }
}
