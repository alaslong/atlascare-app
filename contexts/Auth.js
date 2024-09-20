// contexts/Auth.js
import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const saveTokens = async (accessToken, refreshToken) => {
        await SecureStore.setItemAsync("accessToken", JSON.stringify(accessToken));
        await SecureStore.setItemAsync("refreshToken", JSON.stringify(refreshToken));
    };

    const getTokens = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        return {
            accessToken: accessToken ? JSON.parse(accessToken) : null,
            refreshToken: refreshToken ? JSON.parse(refreshToken) : null,
        };
    };

    const deleteTokens = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
    };

    const refreshAccessToken = async () => {
        const { refreshToken } = await getTokens();
        if (!refreshToken) {
            await deleteTokens();
            return null;
        }

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/refresh`, { refreshToken });
            await saveTokens(response.data.accessToken, response.data.refreshToken);
            return response.data.accessToken;
        } catch (error) {
            await deleteTokens();
            return null;
        }
    };

    const {
        data: user,
        isLoading,
        error,
        refetch: checkAuth,
    } = useQuery({
        queryKey: ["auth", "user"],
        queryFn: async () => {
            const { accessToken } = await getTokens();

            if (!accessToken) {
                const newAccessToken = await refreshAccessToken();
                if (!newAccessToken) return null;

                try {
                    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`, {
                        headers: { Authorization: `Bearer ${newAccessToken}` },
                    });
                    return response.data.user;
                } catch {
                    await deleteTokens();
                    return null;
                }
            }

            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                return response.data.user;
            } catch (authError) {
                if (authError.response?.status === 401) {
                    const refreshedToken = await refreshAccessToken();
                    if (refreshedToken) {
                        try {
                            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`, {
                                headers: { Authorization: `Bearer ${refreshedToken}` },
                            });
                            return response.data.user;
                        } catch {
                            await deleteTokens();
                            return null;
                        }
                    }
                }
                await deleteTokens();
                return null;
            }
        },
        enabled: false,
        retry: false,
    });

    useEffect(() => {
        checkAuth().catch(console.error);
    }, []);

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, credentials);
            await saveTokens(response.data.accessToken, response.data.refreshToken);
            return response.data.user;
        },
        onSuccess: (userData) => {
            queryClient.setQueryData(["auth", "user"], userData);
        },
        onError: (error) => {
            console.error("Login error:", error);
        },
    });

    // Custom login function with onSuccess callback
    const login = (credentials, onSuccess) => {
        loginMutation.mutate(credentials, {
            onSuccess: () => {
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess();
                }
            },
            onError: (error) => {
                console.error("Login error inside login:", error);
            },
        });
    };

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await deleteTokens();
            queryClient.removeQueries(["auth", "user"]);
        },
    });

    const value = {
        user,
        login,
        logout: logoutMutation.mutate,
        checkAuth,
        loading: isLoading,
        error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
