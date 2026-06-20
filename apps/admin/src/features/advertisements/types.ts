import { Tables } from "@repo/api/src/types/database.types";

export type AdvertisementPlacementRow = {
  id: string;
  advertisement_id: string;
  slot_identifier: string;
  created_at: string;
};

export type AdvertisementRow = Tables<"advertisements"> & {
  advertisement_placements?: Pick<AdvertisementPlacementRow, 'slot_identifier'>[];
};
