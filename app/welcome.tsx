import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Truck, User, MapPin } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white px-8 justify-center items-center">
      {/* Header */}
      {/* <View className="pt-16 pb-8 px-6">
        <Text className="text-white text-4xl font-montserrat-bold text-center">
          T'chukudu
        </Text>
        <Text className="text-white/90 text-lg font-montserrat text-center mt-2">
          Votre plateforme de transport
        </Text>
      </View> */}

      {/* Content */}
      <View className=" px-6 py-8 bg-orange-300 w-full rounded-full" style={{ borderRadius: 50 }}>
        <View className="mb-8 items-center">
          <Text className="text-white text-4xl font-montserrat-bold text-center">
            T'chukudu
          </Text>
          <Text className="text-white/90 text-lg font-montserrat text-center mt-2">
            Votre application de transport
          </Text>
        </View>

        {/* Features */}
        <View className="h-36">
          <Image source={require('@/assets/images/car.png')} className="w-full h-full object-contain" />
        </View>
      </View>

      <View className="h-24 w-44 mt-10">
          {/* <Image source={require('@/assets/images/car.png')} className="w-full h-full object-contain" /> */}
      </View>

      {/* Buttons */}
      <View className="gap-y-4 mt-12 w-full px-6">
        <TouchableOpacity
          onPress={() => router.push('/auth/client-phone')}
          className="bg-orange-300 py-4 px-6 rounded-full"
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            Je suis Client
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/transporter-register')}
          className="bg-white border-2 border-orange-300 py-4 px-6 rounded-full"
        >
          <Text className="text-orange-300 text-lg font-montserrat-medium text-center">
            Je suis Transporteur
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/auth/transporter-login')}
        className="mt-6"
      >
        <Text className="text-orange-300 font-montserrat text-center">
          Déjà transporteur ? Se connecter
        </Text>
      </TouchableOpacity>

    </View>
  );
} 