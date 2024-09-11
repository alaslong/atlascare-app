import { useMutation } from "@tanstack/react-query";
import { addProduct, removeProduct } from '@/hooks/post/inventory';

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