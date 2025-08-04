import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { MapPin, Navigation, Phone, Check, X, Settings, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';
import MapComponent from '@/components/MapComponent';
import * as Location from 'expo-location';
import { showToast } from '@/utils/toast';

interface RideNotification {
  id: string;
  client: string;
  pickup: string;
  destination: string;
  price: number;
  distance: string;
  time: string;
  vehicleType: string;
  serviceType: string;
  timestamp: Date;
}

export default function TransporterMapScreen() {
  const { user, isDriverActive, setIsDriverActive, hasSubscription, vehicle, activeRide, setActiveRide } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [latestRideNotification, setLatestRideNotification] = useState<RideNotification | null>(null);
  const [rideCompleted, setRideCompleted] = useState(false);
  const { width, height } = Dimensions.get('window');

  const needsSetup = !vehicle || !hasSubscription;

  useEffect(() => {
    getCurrentLocation();
    if (isDriverActive && !needsSetup && !activeRide) {
      simulateRideNotifications();
    }
  }, [isDriverActive, needsSetup, activeRide]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour recevoir des courses.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const simulateRideNotifications = () => {
    // Simulate receiving a ride notification after 3 seconds
    setTimeout(() => {
      const mockNotification: RideNotification = {
        id: 'ride-' + Date.now(),
        client: 'Marie Kabongo',
        pickup: 'Marché Central, Kinshasa',
        destination: 'Université de Kinshasa',
        price: 35,
        distance: '12 km',
        time: '25 min',
        vehicleType: 'Moto',
        serviceType: 'Standard',
        timestamp: new Date()
      };
      setLatestRideNotification(mockNotification);
    }, 3000);
  };

  const handleAcceptRide = () => {
    if (latestRideNotification) {
      const newActiveRide = {
        id: latestRideNotification.id,
        client: latestRideNotification.client,
        pickup: latestRideNotification.pickup,
        destination: latestRideNotification.destination,
        price: latestRideNotification.price,
        distance: latestRideNotification.distance,
        time: latestRideNotification.time,
        vehicleType: latestRideNotification.vehicleType,
        serviceType: latestRideNotification.serviceType,
        transportType: 'people',
        status: 'accepted' as const,
        acceptedAt: new Date()
      };
      
      setActiveRide(newActiveRide);
      Alert.alert(
        'Course acceptée',
        `Vous avez accepté la course de ${latestRideNotification.client}`,
        [{ text: 'OK' }]
      );
      setLatestRideNotification(null);
    }
  };

  const handleDeclineRide = () => {
    setLatestRideNotification(null);
  };

  const handleToggleAvailability = () => {
    if (needsSetup) {
      Alert.alert(
        'Configuration requise',
        'Vous devez compléter votre profil pour vous mettre en ligne.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Configurer', onPress: () => router.push('/(transporter)/settings') }
        ]
      );
      return;
    }
    setIsDriverActive(!isDriverActive);
  };

  const handleCompleteRide = () => {
    if (activeRide) {
      Alert.alert(
        'Terminer la course',
        `Confirmez-vous que la course pour ${activeRide.client} est terminée ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Confirmer', 
            onPress: () => {
              setRideCompleted(true);
              setActiveRide(null);
              showToast('success', 'Course marquée comme terminée !');
              // Reset after 3 seconds for demo
              setTimeout(() => {
                setRideCompleted(false);
              }, 3000);
            }
          }
        ]
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-4 px-6 bg-yellow-500">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white text-xl font-montserrat-bold">
              Bonjour {user?.fullname}
            </Text>
            <Text className="text-white/90 font-montserrat">
              {isDriverActive && !needsSetup ? 'En ligne - Disponible' : 'Hors ligne'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(transporter)/settings')}>
            <AvatarPlaceholder 
              name={user?.fullname || 'Transporteur'}
              avatar={user?.avatar}
              size={50}
            />
          </TouchableOpacity>
        </View>

        {/* Status Toggle */}
        <View className="mt-4 bg-white/10 rounded-xl p-3 flex-row items-center justify-between">
          <Text className="text-white font-montserrat-medium">
            {isDriverActive && !needsSetup ? 'Vous êtes en ligne' : 'Vous êtes hors ligne'}
          </Text>
          <TouchableOpacity
            onPress={handleToggleAvailability}
            className={`px-4 py-2 rounded-lg ${
              isDriverActive && !needsSetup ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            <Text className="text-white font-montserrat-medium">
              {isDriverActive && !needsSetup ? 'Se déconnecter' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Setup Warning */}
      {needsSetup && (
        <View className="px-6 py-4">
          <View className="bg-red-50 border border-red-200 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <AlertTriangle size={20} color="#dc2626" />
              <Text className="text-red-800 font-montserrat-bold ml-2">
                Configuration requise
              </Text>
            </View>
            <Text className="text-red-700 font-montserrat mb-3">
              Complétez votre profil pour recevoir des courses :
            </Text>
            <View className="space-y-1">
              {!vehicle && (
                <Text className="text-red-600 font-montserrat">
                  • Ajouter les détails de votre véhicule
                </Text>
              )}
              {!hasSubscription && (
                <Text className="text-red-600 font-montserrat">
                  • Souscrire à un abonnement
                </Text>
              )}
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(transporter)/settings')}
              className="bg-red-600 py-2 px-4 rounded-lg mt-3"
            >
              <Text className="text-white font-montserrat-medium text-center">
                Configurer maintenant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Map Area */}
      <View className="flex-1 relative">
        {isDriverActive && !needsSetup && currentLocation && (activeRide || latestRideNotification) ? (
          <MapComponent
            transporters={[]}
            onSelectTransporter={() => {}}
            pickup={activeRide?.pickup || latestRideNotification?.pickup || "Position actuelle"}
            destination={activeRide?.destination || latestRideNotification?.destination || "Destination"}
            showRoute={!!activeRide && !rideCompleted}
            currentLocation={currentLocation.coords}
            isTransporterView={true}
            onCompleteRide={activeRide && !rideCompleted ? handleCompleteRide : undefined}
          />
        ) : (
          <View 
            style={{ width, height: height - 300 }}
            className="bg-gray-200 items-center justify-center"
          >
            <View className="bg-white rounded-xl p-6 mx-4">
              <View className="flex-row items-center mb-4">
                <Navigation size={24} color="#f59e0b" />
                <Text className="text-gray-800 font-montserrat-bold text-lg ml-2">
                  Carte Interactive
                </Text>
              </View>
              
              {currentLocation ? (
                <View>
                  <Text className="text-gray-600 font-montserrat mb-2">
                    📍 Position actuelle
                  </Text>
                  <Text className="text-gray-500 font-montserrat text-sm">
                    Lat: {currentLocation.coords.latitude.toFixed(4)}
                  </Text>
                  <Text className="text-gray-500 font-montserrat text-sm">
                    Lng: {currentLocation.coords.longitude.toFixed(4)}
                  </Text>
                </View>
              ) : (
                <Text className="text-gray-500 font-montserrat text-sm">
                  Localisation en cours...
                </Text>
              )}
              
              <Text className="text-gray-400 font-montserrat text-xs text-center mt-4">
                {activeRide 
                  ? `Course active: ${activeRide.client}`
                  : isDriverActive && !needsSetup 
                  ? 'En attente de nouvelles courses...' 
                  : 'Activez votre disponibilité pour voir les courses'
                }
              </Text>
              
              {rideCompleted && (
                <View className="bg-green-100 border border-green-200 rounded-lg p-3 mt-4">
                  <Text className="text-green-800 font-montserrat-bold text-center">
                    ✅ Course terminée avec succès !
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Ride Notification Overlay */}
        {latestRideNotification && !activeRide && (
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
            
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 font-montserrat-bold text-lg">
                Nouvelle course disponible
              </Text>
              <Text className="text-green-600 font-montserrat-bold text-xl">
                ${latestRideNotification.price}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-800 font-montserrat-bold mb-1">
                Client: {latestRideNotification.client}
              </Text>
              <Text className="text-gray-600 font-montserrat text-sm mb-2">
                {latestRideNotification.vehicleType} • {latestRideNotification.serviceType}
              </Text>
              
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <MapPin size={16} color="#6b7280" />
                  <Text className="text-gray-600 font-montserrat ml-2 flex-1">
                    De: {latestRideNotification.pickup}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin size={16} color="#f59e0b" />
                  <Text className="text-gray-600 font-montserrat ml-2 flex-1">
                    Vers: {latestRideNotification.destination}
                  </Text>
                </View>
              </View>
              
              <Text className="text-gray-500 font-montserrat text-sm mt-2">
                {latestRideNotification.distance} • {latestRideNotification.time}
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleDeclineRide}
                className="flex-1 bg-gray-100 py-3 rounded-lg flex-row items-center justify-center"
              >
                <X size={20} color="#6b7280" />
                <Text className="text-gray-600 font-montserrat-medium ml-2">
                  Refuser
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAcceptRide}
                className="flex-1 bg-yellow-500 py-3 rounded-lg flex-row items-center justify-center"
              >
                <Check size={20} color="white" />
                <Text className="text-white font-montserrat-medium ml-2">
                  Accepter
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(transporter)/rides')}
              className="mt-3 py-2"
            >
              <Text className="text-yellow-500 font-montserrat text-center">
                Voir toutes les courses disponibles
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
      </View>
    </View>
  );
}