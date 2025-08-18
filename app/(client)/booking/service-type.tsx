import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Zap, Clock } from 'lucide-react-native';

export default function ServiceTypeScreen() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { vehicleType } = useLocalSearchParams<{ vehicleType: string }>();

  const serviceTypes = [
    {
      id: 'express',
      name: 'Course Express',
      icon: Zap,
      description: 'Livraison prioritaire et rapide',
      color: 'bg-red-500',
      extra: '+50% du tarif normal'
    },
    {
      id: 'standard',
      name: 'Course Standard',
      icon: Clock,
      description: 'Livraison dans les délais normaux',
      color: 'bg-blue-500',
      extra: 'Tarif standard'
    },
  ];

  const handleContinue = () => {
    if (!selectedService) return;
    router.push({
      pathname: '/(client)/booking/transport-type',
      params: { 
        vehicleType: vehicleType!,
        serviceType: selectedService 
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
          Type de service
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Étape 2/5 : Choisissez la rapidité
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-gray-800 text-lg font-montserrat-bold mb-6">
          Quel type de service souhaitez-vous ?
        </Text>

        <View className="space-y-4">
          {serviceTypes.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => setSelectedService(service.id)}
              className={`border-2 rounded-xl p-4 mb-2 ${
                selectedService === service.id 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-12 h-12 ${service.color} rounded-full items-center justify-center mr-4`}>
                  <service.icon size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold text-lg">
                    {service.name}
                  </Text>
                  <Text className="text-gray-600 font-montserrat">
                    {service.description}
                  </Text>
                  <Text className="text-yellow-600 font-montserrat-medium text-sm mt-1">
                    {service.extra}
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
          disabled={!selectedService}
          className={`py-4 px-6 rounded-xl ${
            selectedService ? 'bg-yellow-500' : 'bg-gray-300'
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