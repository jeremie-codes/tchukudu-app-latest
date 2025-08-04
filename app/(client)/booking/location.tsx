import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Navigation, Target } from 'lucide-react-native';
import * as Location from 'expo-location';
import { showToast } from '@/utils/toast';

export default function LocationScreen() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const { vehicleType, serviceType, transportType } = useLocalSearchParams<{ 
    vehicleType: string; 
    serviceType: string; 
    transportType: string;
  }>();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('error', 'Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Mock reverse geocoding
      setPickup('Position actuelle (GPS)');
    } catch (error) {
      showToast('error', 'Erreur lors de la localisation');
    }
  };

  const handleContinue = () => {
    if (!pickup || !destination) {
      showToast('error', 'Veuillez remplir les deux adresses');
      return;
    }

    router.push({
      pathname: '/(client)/booking/transporters',
      params: { 
        vehicleType: vehicleType!,
        serviceType: serviceType!,
        transportType: transportType!,
        pickup,
        destination
      }
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-montserrat-bold">
          Adresses
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Étape 4/5 : Définissez le trajet
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Pickup Location */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Navigation size={20} color="#f59e0b" />
              <Text className="text-gray-700 font-montserrat-medium ml-2">
                Point de départ
              </Text>
            </View>
            <TouchableOpacity 
              onPress={getCurrentLocation}
              className="bg-yellow-100 px-3 py-1 rounded-full"
            >
              <Text className="text-yellow-600 font-montserrat text-sm">
                GPS
              </Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            value={pickup}
            onChangeText={setPickup}
            placeholder="Adresse de départ"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 font-montserrat"
          />
        </View>

        {/* Destination */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Target size={20} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Destination
            </Text>
          </View>
          
          <TextInput
            value={destination}
            onChangeText={setDestination}
            placeholder="Adresse de destination"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 font-montserrat"
          />
        </View>

        {/* Summary */}
        <View className="bg-gray-50 rounded-xl p-4">
          <Text className="text-gray-800 font-montserrat-bold mb-2">
            Résumé de votre demande
          </Text>
          <Text className="text-gray-600 font-montserrat">
            Véhicule : {vehicleType}
          </Text>
          <Text className="text-gray-600 font-montserrat">
            Service : {serviceType}
          </Text>
          <Text className="text-gray-600 font-montserrat">
            Transport : {transportType}
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!pickup || !destination}
          className={`py-4 px-6 rounded-xl ${
            pickup && destination ? 'bg-yellow-500' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            Rechercher des transporteurs
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}