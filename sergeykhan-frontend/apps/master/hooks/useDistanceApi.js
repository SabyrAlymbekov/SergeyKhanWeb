import { useState } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export const useDistanceApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Token ${token}` : '',
        };
    };
    const fetchMasterAvailableOrdersWithDistance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/orders/available/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch available orders');
            }
            const data = await response.json();
            return data;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    const fetchMasterDistanceWithOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/master/orders/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch master distance info with orders');
            }
            const data = await response.json();
            return data;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    const takeOrder = async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/assign/${orderId}/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    assigned_master: localStorage.getItem('user_id') // The master takes their own order
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to take order');
            }
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while taking the order');
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    return {
        loading,
        error,
        fetchMasterAvailableOrdersWithDistance,
        fetchMasterDistanceWithOrders,
        takeOrder
    };
};
