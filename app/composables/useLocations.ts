import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

export interface Location {
  id: string;
  name: string;
  address: string;
}

export function useLocationsQuery() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data: res } = await axios.get<{
        data: Location[];
      }>("/api/locations");
      return res.data;
    },
    placeholderData: [],
  });
}
