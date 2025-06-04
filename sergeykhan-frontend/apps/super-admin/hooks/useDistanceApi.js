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
    const fetchDistanceSettings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/settings/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch distance settings');
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
    const updateDistanceSettings = async (settings) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/settings/update/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(settings),
            });
            if (!response.ok) {
                throw new Error('Failed to update distance settings');
            }
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return false;
        }
        finally {
            setLoading(false);
        }
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
    const fetchAllMastersDistance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/masters/all/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch all masters distance info');
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
    const forceUpdateAllMastersDistance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/force-update/`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to force update masters distance');
            }
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return false;
        }
        finally {
            setLoading(false);
        }
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
    const setMasterDistanceManually = async (masterId, distanceLevel) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/master/${masterId}/set/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ distance_level: distanceLevel }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to set master distance manually');
            }
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const resetMasterDistanceToAutomatic = async (masterId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/master/${masterId}/reset/`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reset master distance to automatic');
            }
            return true;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const getAllMastersDistanceDetailed = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/distance/masters/all/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch masters distance info');
            }
            const data = await response.json();
            return data;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return [];
        }
        finally {
            setLoading(false);
        }
    };
    return {
        loading,
        error,
        fetchDistanceSettings,
        updateDistanceSettings,
        fetchMasterDistanceInfo,
        fetchAllMastersDistance,
        forceUpdateAllMastersDistance,
        fetchMasterAvailableOrdersWithDistance,
        setMasterDistanceManually,
        resetMasterDistanceToAutomatic,
        getAllMastersDistanceDetailed
    };
};
