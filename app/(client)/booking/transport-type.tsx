import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Package, Users } from 'lucide-react-native';

export default function TransportTypeScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { vehicleType, serviceType } = useLocalSearchParams<{ 
    vehicleType: string; 
    serviceType: string; 
  }>();

  const transportTypes = [
    {
      id: 'goods',
      name: 'Marchandises',
      icon: Package,
      description: 'Transport de colis, équipements, etc.',
      color: 'bg-blue-500'
    },
    {
      id: 'people',
      name: 'Personnes',
      icon: Users,
      description: 'Transport de passagers',
      color: 'bg-green-500'
    },
  ];

  const handleContinue = () => {
    if (!selectedType) return;
    router.push({
      pathname: '/(client)/booking/location',
      params: { 
        vehicleType: vehicleType!,
        serviceType: serviceType!,
        transportType: selectedType 
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
          Type de transport
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Étape 3/5 : Que transportez-vous ?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-gray-800 text-lg font-montserrat-bold mb-6">
          Que souhaitez-vous transporter ?
        </Text>

        <View className="space-y-4">
          {transportTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`border-2 rounded-xl p-4 ${
                selectedType === type.id 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-12 h-12 ${type.color} rounded-full items-center justify-center mr-4`}>
                  <type.icon size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold text-lg">
                    {type.name}
                  </Text>
                  <Text className="text-gray-600 font-montserrat">
                    {type.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedType}
          className={`py-4 px-6 rounded-xl ${
            selectedType ? 'bg-yellow-500' : 'bg-gray-300'
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