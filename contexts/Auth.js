import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component that wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Function to save tokens securely (JSON-encoded)
    const saveTokens = async (accessToken, refreshToken) => {
        await SecureStore.setItemAsync("accessToken", JSON.stringify(accessToken));
        await SecureStore.setItemAsync("refreshToken", JSON.stringify(refreshToken));
    };

    // Function to retrieve tokens (JSON-decoded)
    const getTokens = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        return {
            accessToken: accessToken ? JSON.parse(accessToken) : null,
            refreshToken: refreshToken ? JSON.parse(refreshToken) : null,
        };
    };

    // Function to delete tokens
    const deleteTokens = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
    };

    // Function to refresh access token using refresh token
    const refreshAccessToken = async () => {
        const { refreshToken } = await getTokens();
        if (!refreshToken) {
        //     console.log("No refresh token available, logging out");
            await deleteTokens(); // Remove invalid tokens
            return null;
        }

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/refresh`, {
                refreshToken,
            });

            // Save new access token and refresh token
            await saveTokens(response.data.accessToken, response.data.refreshToken);
            return response.data.accessToken; // Return the new access token
        } catch (error) {
            console.error("Failed to refresh access token:", error);
            await deleteTokens(); // Remove invalid tokens
            return null;
        }
    };

    // React Query to check authentication and refresh token if needed
    const {
        data: user,
        isLoading,
        error,
        refetch: checkAuth,
    } = useQuery({
        queryKey: ["auth", "user"],
        queryFn: async () => {
            const { accessToken, refreshToken } = await getTokens();
            // console.log("Access Token:", accessToken); // Check if the access token exists
            // console.log("Refresh Token:", refreshToken); // Check if the refresh token exists

            // If no access token, try refreshing it using the refresh token
            if (!accessToken) {
                // console.log("No access token, attempting to refresh with refresh token");
                const newAccessToken = await refreshAccessToken();
                if (!newAccessToken) {
                    // console.log("Unable to refresh access token, logging out");
                    await deleteTokens();
                    queryClient.removeQueries(["auth", "user"]); // Remove user from cache
                    router.navigate("/login"); // Redirect to login
                    return null;
                }
                // console.log("Successfully refreshed access token");
                return checkAuth(); // Retry authentication check with new access token
            }

            try {
                // console.log("Making auth check request");
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                // console.log("Check auth response:", response.data);
                return response.data.user; // Token is valid, return user
            } catch (error) {
              
                if (error.response?.status === 401) {
                    // If access token is expired, attempt to refresh it
                    const refreshedToken = await refreshAccessToken();
                    if (refreshedToken) {
                        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`, {
                            headers: { Authorization: `Bearer ${refreshedToken}` },
                        });
                        return response.data.user;
                    }
                }
                await deleteTokens(); // Token is invalid or refresh failed, log out the user
                queryClient.removeQueries(["auth", "user"]); // Remove user from cache
                router.navigate("/login"); // Redirect to login
                return null;
            }
        },
        enabled: false, // Don't automatically run the query
        retry: false, // Don't retry if it fails
    });

    // Fetch user data on mount
    useEffect(() => {
        // console.log("Checking auth status on mount");
        checkAuth(); // This will manually trigger the query
    }, []);

    // React Query mutation for login
    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, credentials);
            await saveTokens(response.data.accessToken, response.data.refreshToken);
            return response.data.user; // Return the user data
        },
        onSuccess: (userData) => {
            queryClient.setQueryData(["auth", "user"], userData); // Set user data in cache
            router.push("/scan"); // Navigate to scan
        },
        onError: (error) => {
            console.error("Login error:", error);
        },
    });

    // React Query mutation for logout
    const logoutMutation = useMutation({
        mutationFn: async () => {
            await deleteTokens(); // Remove tokens from SecureStore
            queryClient.removeQueries(["auth", "user"]); // Remove user from cache
            router.navigate("/login"); // Navigate to login screen
        },
    });

    const value = {
        user,
        login: loginMutation.mutate, // Expose login mutation
        logout: logoutMutation.mutate, // Expose logout mutation
        checkAuth, // Expose checkAuth function to refetch user data
        loading: isLoading, // Loading state for auth check
        error, // Error state for auth check
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
