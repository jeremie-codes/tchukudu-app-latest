import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { MapPin, Clock, DollarSign, Check, X, Filter } from 'lucide-react-native';
import { getAvailableRides } from '@/api/rides';
import { showToast } from '@/utils/toast';

interface Ride {
  id: string;
  pickup: string;
  destination: string;
  client: string;
  vehicleType: string;
  serviceType: string;
  transportType: string;
  estimatedPrice: number;
  distance: string;
  time: string;
  status?: 'available' | 'completed' | 'cancelled';
  date?: string;
}

type FilterType = 'available' | 'completed' | 'cancelled' | 'all';

export default function RidesScreen() {
  const { isDriverActive, hasSubscription, vehicle, activeRide, setActiveRide } = useAppContext();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('available');

  useEffect(() => {
    loadRides();
  }, [filter]);

  const loadRides = async () => {
    setLoading(true);
    try {
      if (filter === 'available') {
        const data = await getAvailableRides();
        setRides(data.map(ride => ({ ...ride, status: 'available' })));
      } else {
        // Mock historical data
        const mockHistory: Ride[] = [
          {
            id: '1',
            pickup: 'Marché Central',
            destination: 'Gombe',
            client: 'Pierre Mukendi',
            vehicleType: 'Moto',
            serviceType: 'Express',
            transportType: 'people',
            estimatedPrice: 25,
            distance: '8 km',
            time: '15 min',
            status: 'completed',
            date: '15 Jan 2025'
          },
          {
            id: '2',
            pickup: 'Université',
            destination: 'Aéroport',
            client: 'Marie Kabila',
            vehicleType: 'Camion',
            serviceType: 'Standard',
            transportType: 'goods',
            estimatedPrice: 75,
            distance: '25 km',
            time: '35 min',
            status: 'cancelled',
            date: '14 Jan 2025'
          }
        ];
        
        if (filter === 'all') {
          setRides(mockHistory);
        } else {
          setRides(mockHistory.filter(ride => ride.status === filter));
        }
      }
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (activeRide) {
      showToast('error', 'Vous avez déjà une course active');
      return;
    }

    const selectedRide = rides.find(r => r.id === rideId);
    if (!selectedRide) return;

    const newActiveRide = {
      id: selectedRide.id,
      client: selectedRide.client,
      pickup: selectedRide.pickup,
      destination: selectedRide.destination,
      price: selectedRide.estimatedPrice,
      distance: selectedRide.distance,
      time: selectedRide.time,
      vehicleType: selectedRide.vehicleType,
      serviceType: selectedRide.serviceType,
      transportType: selectedRide.transportType,
      status: 'accepted' as const,
      acceptedAt: new Date()
    };

    await setActiveRide(newActiveRide);
    showToast('success', 'Course acceptée ! Redirection vers la carte...');
    
    // Rediriger vers l'index avec la course active
    setTimeout(() => {
      router.push('/(transporter)');
    }, 1000);
  };

  const handleDeclineRide = async (rideId: string) => {
    setRides(rides.filter(r => r.id !== rideId));
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'available': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      case 'available': return 'Disponible';
      default: return status;
    }
  };

  const filterOptions = [
    { key: 'available', label: 'Disponibles', count: rides.filter(r => r.status === 'available').length },
    { key: 'completed', label: 'Terminées', count: 0 },
    { key: 'cancelled', label: 'Annulées', count: 0 },
    { key: 'all', label: 'Historique', count: 0 }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <Text className="text-white text-2xl font-montserrat-bold">
          Mes courses
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Gérez vos courses et votre historique
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="px-6 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setFilter(option.key as FilterType)}
                className={`px-4 py-2 rounded-full border ${
                  filter === option.key
                    ? 'bg-yellow-500 border-yellow-500'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-montserrat-medium ${
                  filter === option.key ? 'text-white' : 'text-gray-600'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6">
        {!isDriverActive && filter === 'available' ? (
          <View className="items-center py-12">
            <Clock size={48} color="#9ca3af" />
            <Text className="text-gray-500 font-montserrat-medium text-lg mt-4">
              Vous êtes hors ligne
            </Text>
            <Text className="text-gray-400 font-montserrat text-center mt-2">
              Activez votre disponibilité pour voir les courses
            </Text>
          </View>
        ) : activeRide && filter === 'available' ? (
          <View className="items-center py-12">
            <Clock size={48} color="#f59e0b" />
            <Text className="text-yellow-600 font-montserrat-medium text-lg mt-4">
              Course active en cours
            </Text>
            <Text className="text-gray-400 font-montserrat text-center mt-2">
              Terminez votre course actuelle pour en accepter une nouvelle
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(transporter)')}
              className="bg-yellow-500 px-6 py-3 rounded-lg mt-4"
            >
              <Text className="text-white font-montserrat-medium">
                Voir la course active
              </Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-500 font-montserrat">
              Chargement...
            </Text>
          </View>
        ) : rides.length === 0 ? (
          <View className="items-center py-12">
            <Clock size={48} color="#9ca3af" />
            <Text className="text-gray-500 font-montserrat-medium text-lg mt-4">
              {filter === 'available' ? 'Aucune course disponible' : 'Aucune course dans l\'historique'}
            </Text>
            <Text className="text-gray-400 font-montserrat text-center mt-2">
              {filter === 'available' 
                ? 'Les nouvelles demandes apparaîtront ici'
                : 'Vos courses passées apparaîtront ici'
              }
            </Text>
          </View>
        ) : (
          <View className="space-y-4 pb-6">
            {rides.map((ride) => (
              <View key={ride.id} className="bg-white rounded-xl p-4 shadow-xl mb-3">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-800 font-montserrat-bold text-lg">
                      {ride.client}
                    </Text>
                    <Text className="text-gray-600 font-montserrat">
                      {ride.vehicleType} • {ride.serviceType}
                    </Text>
                    {ride.date && (
                      <Text className="text-gray-500 font-montserrat text-sm">
                        {ride.date}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-green-600 font-montserrat-bold text-lg">
                      ${ride.estimatedPrice}
                    </Text>
                    <Text className="text-gray-500 font-montserrat text-sm">
                      {ride.distance} • {ride.time}
                    </Text>
                    {ride.status && (
                      <View className={`px-2 py-1 rounded-full mt-1 ${getStatusColor(ride.status)}`}>
                        <Text className={`font-montserrat-medium text-xs ${getStatusColor(ride.status).split(' ')[0]}`}>
                          {getStatusText(ride.status)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View className="space-y-2 mb-4">
                  <View className="flex-row items-center">
                    <MapPin size={16} color="#6b7280" />
                    <Text className="text-gray-600 font-montserrat ml-2 flex-1">
                      De: {ride.pickup}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MapPin size={16} color="#f59e0b" />
                    <Text className="text-gray-600 font-montserrat ml-2 flex-1">
                      Vers: {ride.destination}
                    </Text>
                  </View>
                </View>

                {ride.status === 'available' && (
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={() => handleDeclineRide(ride.id)}
                      className="flex-1 bg-gray-100 py-3 rounded-lg flex-row items-center justify-center"
                    >
                      <X size={20} color="#6b7280" />
                      <Text className="text-gray-600 font-montserrat-medium ml-2">
                        Refuser
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleAcceptRide(ride.id)}
                      disabled={!!activeRide}
                      className={`flex-1 py-3 rounded-lg flex-row items-center justify-center ${
                        activeRide ? 'bg-gray-300' : 'bg-yellow-500'
                      }`}
                    >
                      <Check size={20} color="white" />
                      <Text className="text-white font-montserrat-medium ml-2">
                        {activeRide ? 'Course active' : 'Accepter'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}