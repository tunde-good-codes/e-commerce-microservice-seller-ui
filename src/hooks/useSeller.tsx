import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchSeller = async () => {
  try {
    const res = await axiosInstance.get("/auth/auth-seller", {
      withCredentials: true,
    });
    return res.data.seller;
  } catch (error: any) {
    // ✅ Return null instead of throwing for 401 errors
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

const useSeller = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["seller"],
    queryFn: fetchSeller,
    staleTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    seller: data ?? null,
    isLoading,
    isError,
    refetch,
  };
};

export default useSeller;