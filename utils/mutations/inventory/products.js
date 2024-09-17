import { useMutation } from "@tanstack/react-query";
import { addProduct, removeProduct } from '@/hooks/post/inventory';
import { fetchInventoryProduct } from "../../../hooks/fetch/inventory";

// Mutation for adding product to inventory using axios
export const useAddToInventory = () => {
    return useMutation({
        mutationKey: 'addToInventory',
        mutationFn: addProduct, // Function imported from another file
        onError: () => {
            console.error("Error adding to inventory");
        },
        onSuccess: () => {
            console.log("Product successfully added to inventory");
        },
    });
};

// Mutation for removing product from inventory using axios
export const useRemoveFromInventory = () => {
    return useMutation({
        mutationKey: 'removeFromInventory',
        mutationFn: removeProduct, // Function imported from another file
        onError: () => {
            console.error("Error removing from inventory");
        },
        onSuccess: () => {
            console.log("Product successfully removed from inventory");
        },
    });
};

// Custom hook to fetch a specific product's inventory info using mutation
export const useFetchInventoryProduct = () => {
    return useMutation({
        mutationKey: 'fetchInventoryProduct', // Unique key for mutation cache
        mutationFn: fetchInventoryProduct, // Explicit mutation function
        onError: () => {
            console.error("Error fetching product inventory");
        },
        onSuccess: (data) => {
            console.log("Product inventory fetched successfully", data);
        },
    });
};