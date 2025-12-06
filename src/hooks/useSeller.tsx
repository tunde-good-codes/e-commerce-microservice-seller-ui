import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchSeller = async () => {
  const res = await axiosInstance.get("/auth/auth-seller", {
    withCredentials: true,
  });
  return res.data.seller;
};

const useSeller = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["seller"],
    queryFn: fetchSeller,
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: false,              // stop retrying invalid tokens
    initialData: () => queryClient.getQueryData(["seller"]), // KEY FIX
    refetchOnWindowFocus: false, // prevents extra calls
  });

  return {
    seller: data ?? null,
    isLoading,
    isError,
    refetch,
  };
};

export default useSeller;
