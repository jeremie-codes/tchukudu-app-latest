import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  phone: string;
  fullname?: string;
  email?: string;
  avatar?: string;
  type: 'client' | 'transporter';
  isProfileComplete?: boolean;
  vehicule: Vehicle[];
}

export interface Vehicle {
  id: string;
  type: 'truck' | 'motorcycle' | 'van' | 'car';
  capacity: number;
  pricePerKm: number;
  pricePerKg?: number;
  licensePlate: string;
  model: string;
  image?: string;
}

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userType: 'client' | 'transporter' | null;
  setUserType: (type: 'client' | 'transporter' | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  vehicle: Vehicle | null;
  setVehicle: (vehicle: Vehicle | null) => void;
  isDriverActive: boolean;
  setIsDriverActive: (active: boolean) => void;
  hasSubscription: boolean;
  setHasSubscription: (has: boolean) => void;
  activeRide: ActiveRide | null;
  setActiveRide: (ride: ActiveRide | null) => void;
}

export interface ActiveRide {
  id: string;
  client: string;
  pickup: string;
  destination: string;
  price: number;
  distance: string;
  time: string;
  vehicleType: string;
  serviceType: string;
  transportType: string;
  status: 'accepted' | 'pickup' | 'inProgress' | 'completed';
  acceptedAt: Date;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'client' | 'transporter' | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isDriverActive, setIsDriverActive] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const userTypeData = await AsyncStorage.getItem('userType');
      const vehicleData = await AsyncStorage.getItem('vehicle');
      const activeStatus = await AsyncStorage.getItem('isDriverActive');
      const subscriptionStatus = await AsyncStorage.getItem('hasSubscription');
      const activeRideData = await AsyncStorage.getItem('activeRide');
      
      if (userData) setUser(JSON.parse(userData));
      if (userTypeData) setUserType(userTypeData as 'client' | 'transporter');
      if (vehicleData) setVehicle(JSON.parse(vehicleData));
      if (activeStatus) setIsDriverActive(JSON.parse(activeStatus));
      if (subscriptionStatus) setHasSubscription(JSON.parse(subscriptionStatus));
      if (activeRideData) setActiveRide(JSON.parse(activeRideData));
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'userType', 'vehicle', 'isDriverActive', 'hasSubscription', 'activeRide']);
      setUser(null);
      setUserType(null);
      setVehicle(null);
      setIsDriverActive(false);
      setHasSubscription(false);
      setActiveRide(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const updateUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const updateUserType = async (type: 'client' | 'transporter' | null) => {
    setUserType(type);
    if (type) {
      await AsyncStorage.setItem('userType', type);
    }
  };

  const updateVehicle = async (newVehicle: Vehicle | null) => {
    setVehicle(newVehicle);
    if (newVehicle) {
      await AsyncStorage.setItem('vehicle', JSON.stringify(newVehicle));
    }
  };

  const updateDriverActive = async (active: boolean) => {
    setIsDriverActive(active);
    await AsyncStorage.setItem('isDriverActive', JSON.stringify(active));
  };

  const updateSubscription = async (has: boolean) => {
    setHasSubscription(has);
    await AsyncStorage.setItem('hasSubscription', JSON.stringify(has));
  };

  const updateActiveRide = async (ride: ActiveRide | null) => {
    setActiveRide(ride);
    if (ride) {
      await AsyncStorage.setItem('activeRide', JSON.stringify(ride));
    } else {
      await AsyncStorage.removeItem('activeRide');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser: updateUser,
        userType,
        setUserType: updateUserType,
        isAuthenticated,
        logout,
        vehicle,
        setVehicle: updateVehicle,
        isDriverActive,
        setIsDriverActive: updateDriverActive,
        hasSubscription,
        setHasSubscription: updateSubscription,
        activeRide,
        setActiveRide: updateActiveRide,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}