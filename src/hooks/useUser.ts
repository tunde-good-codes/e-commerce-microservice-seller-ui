import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchUser = async () => {
  const res = await axiosInstance.get("/auth/auth-user", {
    withCredentials: true,
  });
  return res.data.user;
};

const useUser = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: false,              // stop retrying invalid tokens
    initialData: () => queryClient.getQueryData(["user"]), // KEY FIX
    refetchOnWindowFocus: false, // prevents extra calls
  });

  return {
    user: data ?? null,
    isLoading,
    isError,
    refetch,
  };
};

export default useUser;
