import { Service } from "typedi";
import { ProfilePhoto } from "@src/entity/ProfilePhoto";
import { CreateProfilePhotoInput } from "@src/resolvers/user/CreateProfilePhotoInput";
import { User } from "@src/entity/User";
import { MediaService } from "@src/services/MediaService";

@Service()
export class ProfilePhotoService {
  constructor(private mediaService: MediaService) {}

  async create(options: CreateProfilePhotoInput): Promise<ProfilePhoto> {
    const { url, public_id } = await this.mediaService.uploadProfileImage(
      options
    );
    const newProfilePhoto: CreateProfilePhotoInput = {
      data: url,
      type: options.type,
      publicId: public_id,
    };
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
