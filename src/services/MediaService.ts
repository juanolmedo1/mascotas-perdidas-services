import Cloudinary, { ResourceApiResponse, UploadApiResponse } from "cloudinary";
import { Service } from "typedi";
import { CreatePetPhotoInput } from "@resolvers/pet/CreatePetPhotoInput";
import { CreateProfilePhotoInput } from "@resolvers/user/CreateProfilePhotoInput";
import { CreatePhotoInput } from "@src/resolvers/photo/CreatePhotoInput";

@Service()
export class MediaService {
  constructor() {
    const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;
    Cloudinary.v2.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Cloudinary.v2.api.delete_resources([publicId], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  async uploadTemporalPublicationImage(
    options: CreatePhotoInput
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      Cloudinary.v2.uploader.upload(
        `data:${options.type};base64,${options.data}`,
        { use_filename: false, folder: `temporal_publications` },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  }

  async uploadPublicationImage(
    options: CreatePetPhotoInput
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      Cloudinary.v2.uploader.upload(
        `data:${options.type};base64,${options.data}`,
        { use_filename: false, folder: `publications` },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  }

  async uploadProfileImage(
    options: CreateProfilePhotoInput
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      Cloudinary.v2.uploader.upload(
        `data:${options.type};base64,${options.data}`,
        { use_filename: false, folder: `profile` },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  }

  async getPhotosByTag(tag: string): Promise<ResourceApiResponse> {
    return new Promise((resolve, reject) => {
      Cloudinary.v2.api.resources_by_tag(tag, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
}
