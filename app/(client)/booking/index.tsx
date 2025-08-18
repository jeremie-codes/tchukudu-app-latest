import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Truck, Bike, Car, Package } from 'lucide-react-native';

export default function BookingScreen() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const vehicleTypes = [
    { 
      id: 'truck', 
      name: 'Camion', 
      icon: Truck, 
      description: 'Pour marchandises lourdes',
      color: 'bg-blue-500'
    },
    { 
      id: 'motorcycle', 
      name: 'Moto', 
      icon: Bike, 
      description: 'Livraison rapide',
      color: 'bg-green-500'
    },
    { 
      id: 'van', 
      name: 'Fourgonnette', 
      icon: Package,
      description: 'Transport moyen',
      color: 'bg-purple-500'
    },
    { 
      id: 'car', 
      name: 'Voiture', 
      icon: Car, 
      description: 'Transport personnel',
      color: 'bg-orange-500'
    },
  ];

  const handleContinue = () => {
    if (!selectedVehicle) return;
    router.push({
      pathname: '/(client)/booking/service-type',
      params: { vehicleType: selectedVehicle }
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
          Réserver une course
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Étape 1/5 : Choisissez un véhicule
        </Text>
      </View>

      <View className='p-6'>
        <Text className="text-gray-800 text-xl font-montserrat-bold mb-6">
          Type de véhicule
        </Text>
      </View>
      
      <ScrollView className=" flex-1 mx-4" horizontal showsHorizontalScrollIndicator={false}>

          {vehicleTypes.map((vehicle) => (
            <View className="space-y-4 mr-3" key={vehicle.id}>
                <TouchableOpacity
                  onPress={() => setSelectedVehicle(vehicle.id)}
                  className={`border-2 rounded-xl p-4 h-80 w-[300] ${
                    selectedVehicle === vehicle.id 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-montserrat-bold text-lg">
                      {vehicle.name}
                    </Text>
                    <Text className="text-gray-600 font-montserrat">
                      {vehicle.description}
                    </Text>
                  </View>
                  <View className="flex-1 items-center ">
                    <View className={`flex-1 ${vehicle.color} items-center rounded-lg justify-center w-full`}>
                      <vehicle.icon size={100} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedVehicle}
          className={`py-4 px-6 rounded-xl ${
            selectedVehicle ? 'bg-yellow-500' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}