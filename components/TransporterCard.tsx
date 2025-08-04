import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Star, MapPin, Phone } from 'lucide-react-native';
import AvatarPlaceholder from './AvatarPlaceholder';

interface Transporter {
  id: string;
  name: string;
  rating: number;
  distance: string;
  vehicle: string;
  price: number;
  phone: string;
  reviews: number;
  vehicleImage?: string;
}

interface TransporterCardProps {
  transporter: Transporter;
  onSelect: () => void;
}

export default function TransporterCard({ transporter, onSelect }: TransporterCardProps) {
  return (
    <TouchableOpacity 
      onPress={onSelect}
      className="bg-white rounded-xl p-4 border border-gray-100 mb-3 shadow-xl"
    >
      <View className="flex-row items-start">
        <AvatarPlaceholder 
          name={transporter.name}
          size={50}
        />
        
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-800 font-montserrat-bold text-lg">
              {transporter.name}
            </Text>
            <Text className="text-green-600 font-montserrat-bold text-lg">
              ${transporter.price}
            </Text>
          </View>
          
          <Text className="text-gray-600 font-montserrat mb-2">
            {transporter.vehicle}
          </Text>
          
          {transporter.vehicleImage ? (
            <Image
              source={{ uri: transporter.vehicleImage }}
              className="w-full h-24 rounded-lg mb-2"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-24 bg-gray-100 rounded-lg mb-2 items-center justify-center">
              <Text className="text-gray-400 font-montserrat text-sm">
                Aucune photo
              </Text>
            </View>
          )}
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-gray-600 font-montserrat text-sm ml-1">
                {transporter.rating} ({transporter.reviews} avis)
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <MapPin size={14} color="#6b7280" />
              <Text className="text-gray-500 font-montserrat text-sm ml-1">
                {transporter.distance}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className="mt-4 pt-4 border-t border-gray-100">
        <TouchableOpacity className="bg-yellow-500 py-3 rounded-lg">
          <Text className="text-white font-montserrat-medium text-center">
            Sélectionner ce transporteur
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}