"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Search,
  Pencil,
  Trash,
  Eye,
  Plus,
  BarChart,
  Star,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import DeleteConfirmationModal from "@/shared/modals/delete-confirmation-modal/DeleteConfirmationModal";

const fetchProducts = async () => {
  const res = await axiosInstance.get("/product/get-shop-product");
  return res.data.products;
};
const deleteProducts = async (productId: string) => {
  const res = await axiosInstance.delete(
    `/product/delete-product/${productId}`
  );
  return res.data.products;
};
const restoreProducts = async (productId: string) => {
  const res = await axiosInstance.put(
    `/product/restore-product/${productId}`
  );
  return res.data.products;
};
const ProductLists = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [analyticsData, setAnalyticsData] = useState("");
  const [showAnalyticsData, setShowAnalyticsData] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop=products"],
      });
      setShowDeleteModal(false);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop=products"],
      });
      setShowDeleteModal(false);
    },
  });
  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "image",
        cell: ({ row }: any) => (
          <Image
            src={row.original.images[0].url}
            alt={row.original.images[0].url}
            width={200}
            height={200}
            className="w-12 h-12 rounded-md  object-cover "
          />
        ),
      },

      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }: any) => {
          const truncatedTitle =
            row.original.title.length > 25
              ? `${row.original.title.substring(0, 25)}`
              : row.original.title;
          return (
            <Link
              title={row.original.title}
              href={`${process.env.NEXT_PUBLIC_UI_URI}/product/${row.original.slug}`}
              className="text-blue-400 hover:underline"
            >
              {truncatedTitle}
            </Link>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: any) => {
          <span>{row.original.sale_price}</span>;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: any) => {
          <span
            className={row.original.stock < 10 ? " text-red-500" : "text-white"}
          >
            {row.original.stock} left
          </span>;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }: any) => {
          <div className="flex items-center gap-1 text-yellow-400 ">
            <Star fill="#fde047" size={18} />
            <span className="text-white ">{row.original.ratings || 5}</span>
            {row.original.stock} left
          </div>;
        },
      },
      {
        accessorKey: "Action",
        cell: ({ row }: any) => {
          <div className="flex gap-3 ">
            <Link
              href={`/product/${row.original.id}`}
              className="text-blue-400 hover:text-blue-200 transition"
            >
              <Eye size={18} />
            </Link>
            <Link
              href={`/product/edit/${row.original.id}`}
              className="text-yellow-400 hover:text-yellow-200 transition"
            >
              <Pencil size={18} />
            </Link>
            <button className="text-green-400 hover:text-green-200 transition">
              <BarChart size={18} />
            </button>
            <button
              className="text-red-400 hover:text-red-200 transition"
              onClick={() => openDeleteModal(row.original)}
            >
              <Trash size={18} />
            </button>
          </div>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full min-h-screen p-8   ">
      <div className="flex justify-between items-center mb-1  ">
        <h2 className="text-2xl text-white font-semibold ">All Products</h2>
        <Link
          href={"/dashboard/create-product"}
          className="bg-blue-500 hover:bg-blue-700 px-4 py-2  text-white rounded-lg "
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>
      <div className="flex items-center mb-4  ">
        <Link href={"/dashboard"} className="bg-blue-400 cursor-pointer ">
          <ChevronRight size={20} className="text-gray-200" /> Add Product
          <span className="text-white">All Products</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4 rounded-md flex-1 bg-gray-900 p-2  ">
        <Search size={18} className="text-gray-400 mr-2" />

        <input
          type="text"
          placeholder="Search Products..."
          className="w-full bg-transparent text-white outline-none "
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4 ">
        {isLoading ? (
          <p className="text-white text-center ">Loading Products...</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition  "
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="p-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            product={selectedProduct}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() =>
              deleteMutation.mutate(selectedProduct?.id)
            }
            onRestore={() => restoreMutation.mutate(selectedProduct?.id)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductLists;
