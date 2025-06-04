"use client";
import { useState } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
export const useDistanceApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        };
    };
    const fetchMasterDistanceInfo = async (masterId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/master/${masterId}/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch master distance info');
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
                throw new Error('Failed to fetch master distance with orders');
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
    return {
        loading,
        error,
        fetchMasterDistanceInfo,
        fetchMasterDistanceWithOrders,
    };
};
