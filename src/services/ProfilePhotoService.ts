import { Service } from "typedi";
import { ProfilePhoto } from "@src/entity/ProfilePhoto";
import { CreateProfilePhotoInput } from "@src/resolvers/user/CreateProfilePhotoInput";
import { User } from "@src/entity/User";
import { MediaService } from "@src/services/MediaService";

@Service()
export class ProfilePhotoService {
  constructor(private mediaService: MediaService) {}

  async create(options: CreateProfilePhotoInput): Promise<ProfilePhoto> {
    let newProfilePhoto: CreateProfilePhotoInput;
    if (!options.data) {
      newProfilePhoto = {
        data:
          "https://res.cloudinary.com/mascotas-perdidas/image/upload/v1600796210/profile/blank-profile-picture-973460_640_hs0ssr.png",
        type: "image/png",
        publicId: "profile/blank-profile-picture-973460_640_hs0ssr",
      };
    } else {
      const { url, public_id } = await this.mediaService.uploadProfileImage(
        options
      );
      newProfilePhoto = {
        data: url,
        type: options.type,
        publicId: public_id,
      };
    }
    return ProfilePhoto.create(newProfilePhoto).save();
  }

  async delete(id: string): Promise<ProfilePhoto> {
    const deletedProfilePhoto = await ProfilePhoto.findOne(id);
    if (!deletedProfilePhoto) throw new Error("Photo was not found.");
    await this.mediaService.deleteImage(deletedProfilePhoto.publicId);
    await ProfilePhoto.delete(id);
    return deletedProfilePhoto;
  }

  async getFromUser({ id }: User): Promise<ProfilePhoto> {
    const profilePictureArray = await ProfilePhoto.find({
      where: { userId: id },
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
