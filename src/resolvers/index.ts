import { PublicationResolver } from "@src/resolvers/publication/PublicationResolver";
import { UserResolver } from "@src/resolvers/user/UserResolver";
import { UbicationResolver } from "@src/resolvers/ubication/UbicationResolver";
import { PetResolver } from "@src/resolvers/pet/PetResolver";
import { NotificationResolver } from "@src/resolvers/notification/NotificationResolver";

export default [
  PublicationResolver,
  UserResolver,
  UbicationResolver,
  PetResolver,
  NotificationResolver,
];
