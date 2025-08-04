import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Map, List, Star, Clock, Phone } from 'lucide-react-native';
import TransporterCard from '@/components/TransporterCard';
import MapComponent from '@/components/MapComponent';
import { getAvailableTransporters } from '@/api/rides';

interface Transporter {
  id: string;
  name: string;
  rating: number;
  distance: string;
  vehicle: string;
  price: number;
  location: { latitude: number; longitude: number };
  phone: string;
  reviews: number;
}

export default function TransportersScreen() {
  const [showMap, setShowMap] = useState(false);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [loading, setLoading] = useState(true);
  
  const params = useLocalSearchParams<{
    vehicleType: string;
    serviceType: string;
    transportType: string;
    pickup: string;
    destination: string;
  }>();

  useEffect(() => {
    loadTransporters();
  }, []);

  const loadTransporters = async () => {
    try {
      const data = await getAvailableTransporters(params);
      setTransporters(data);
    } catch (error) {
      console.error('Error loading transporters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTransporter = (transporter: Transporter) => {
    router.push({
      pathname: '/(client)/booking/ride-tracking',
      params: {
        ...params,
        transporterId: transporter.id,
        transporterName: transporter.name,
        transporterPhone: transporter.phone,
        price: transporter.price.toString()
      }
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View className="self-center">
            <Text className="text-white text-2xl font-montserrat-bold">
              Transporteurs
            </Text>
            <Text className="text-white/90 font-montserrat mt-2">
              {transporters.length} transporteurs disponibles
            </Text>
          </View>
        </View>
      
        {/* View Toggle */}
        <View className="mt-4 bg-white/10 rounded-xl p-1 flex-row">
          <TouchableOpacity
            onPress={() => setShowMap(false)}
            className={`flex-1 flex-row items-center justify-center py-2 px-4 rounded-lg ${
              !showMap ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <List size={18} color={!showMap ? "#f59e0b" : "white"} />
            <Text className={`font-montserrat-medium ml-2 ${
              !showMap ? 'text-yellow-500' : 'text-white'
            }`}>
              Liste
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowMap(true)}
            className={`flex-1 flex-row items-center justify-center py-2 px-4 rounded-lg ${
              showMap ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Map size={18} color={showMap ? "#f59e0b" : "white"} />
            <Text className={`font-montserrat-medium ml-2 ${
              showMap ? 'text-yellow-500' : 'text-white'
            }`}>
              Carte
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showMap ? (
        <MapComponent
          transporters={transporters}
          onSelectTransporter={handleSelectTransporter}
          pickup={params.pickup!}
          destination={params.destination!}
          currentLocation={null}
        />
      ) : (
        <ScrollView className="flex-1 px-6 py-6">
          {loading ? (
            <View className="items-center py-8">
              <Text className="text-gray-500 font-montserrat">
                Recherche en cours...
              </Text>
            </View>
          ) : (
            <View className="space-y-4 mb-10">
              {transporters.map((transporter) => (
                <TransporterCard
                  key={transporter.id}
                  transporter={transporter}
                  onSelect={() => handleSelectTransporter(transporter)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}