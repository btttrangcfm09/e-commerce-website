import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart';

export const useCartQuery = () => {
    const queryClient = useQueryClient();

    const cart = useQuery({
        queryKey: ['cart'],
        queryFn: () => cartService.getCart(),
    });

    const addItem = useMutation({
        mutationFn: ({ productId, quantity }) => cartService.addToCart(productId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
        },
    });

    const updateItem = useMutation({
        mutationFn: ({ productId, quantity }) => cartService.updateCart(productId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
        },
    });

    const removeItem = useMutation({
        mutationFn: (productId) => cartService.removeFromCart(productId),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
        },
    });

    return {
        cart: cart.data?.data,
        isLoading: cart.isLoading,
        addItem: addItem.mutate,
        addItemAsync: addItem.mutateAsync,
        updateItem: updateItem.mutate,
        updateItemAsync: updateItem.mutateAsync,
        removeItem: removeItem.mutate,
        removeItemAsync: removeItem.mutateAsync,
    };
};
