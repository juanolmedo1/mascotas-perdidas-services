import { PublicationResolver } from "@src/resolvers/publication/PublicationResolver";
import { UserResolver } from "@src/resolvers/user/UserResolver";
import { UbicationResolver } from "@src/resolvers/ubication/UbicationResolver";
import { PetResolver } from "@src/resolvers/pet/PetResolver";
import { NotificationResolver } from "@src/resolvers/notification/NotificationResolver";
import { TemporalPublicationResolver } from "@src/resolvers/temporalPublication/TemporalPublicationResolver";

export default [
  PublicationResolver,
  TemporalPublicationResolver,
  UserResolver,
  UbicationResolver,
  PetResolver,
  NotificationResolver,
];
