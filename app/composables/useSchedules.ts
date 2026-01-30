import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

export interface Schedule {
  id: string;
  location_id: string;
  note: string | null;
  completed: boolean;
  name: string;
  address: string;
}

export function useSchedulesQuery() {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data: res } = await axios.get<{ data: Schedule[] }>(
        "/api/schedules",
      );
      return res.data;
    },
    placeholderData: [],
  });
}

export function useAddSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationId: string) => {
      const res = await axios.post("/api/schedules", {
        location_id: locationId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: any) => {
      alert("加入行程失敗");
      console.error("加入行程失敗:", error);
    },
  });
}

export function useRemoveSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const res = await axios.delete(`/api/schedules/${scheduleId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: any) => {
      alert("刪除行程失敗");
      console.error("刪除行程失敗:", error);
    },
  });
}

export function useToggleCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: Schedule) => {
      const res = await axios.put(`/api/schedules/${schedule.id}`, {
        completed: schedule.completed,
      });
      return res.data;
    },

    // 樂觀更新
    onMutate: async (schedule) => {
      await queryClient.cancelQueries({ queryKey: ["schedules"] });
      const previous = queryClient.getQueryData<Schedule[]>(["schedules"]);

      // 立刻更新 UI
      queryClient.setQueryData<Schedule[]>(["schedules"], (old) => {
        if (!old) return old;

        return old.map((item) => {
          if (item.id === schedule.id) {
            return { ...item, completed: schedule.completed };
          }
          return item;
        });
      });

      return { previous };
    },
    // 失敗
    onError: (_error, _schedule, context) => {
      // 失敗就還原
      queryClient.setQueryData(["schedules"], context?.previous);
      alert("更新失敗");
    },
    // 成功
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
