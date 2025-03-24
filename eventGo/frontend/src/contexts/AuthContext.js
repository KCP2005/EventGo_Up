import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setUser({
            walletAddress: accounts[0],
            provider: provider
          });
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setError('Failed to check wallet connection');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        setUser({
          walletAddress: accounts[0],
          provider: provider
        });
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
      throw err;
    }
  };

  const disconnectWallet = async () => {
    try {
      setUser(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    connectWallet,
    disconnectWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 