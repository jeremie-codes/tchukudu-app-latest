import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { MapPin, Truck, Clock, CarFrontIcon, Star, TrendingUp, Shield, Zap } from 'lucide-react-native';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';

export default function ClientHomeScreen() {
  const { user } = useAppContext();
  const [greeting, setGreeting] = useState('');
  const { width } = Dimensions.get('window');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  const stats = [
    { icon: Truck, label: '500+', subtitle: 'Transporteurs', color: 'bg-blue-500' },
    { icon: Clock, label: '24/7', subtitle: 'Disponible', color: 'bg-green-500' },
    { icon: Star, label: '4.8', subtitle: 'Note moyenne', color: 'bg-yellow-500' },
  ];

  const services = [
    {
      title: 'Transport Express',
      description: 'Livraison rapide en moins de 30 minutes',
      icon: Zap,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Transport Standard',
      description: 'Solution économique pour vos besoins',
      icon: Truck,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Transport Sécurisé',
      description: 'Transporteurs vérifiés et assurés',
      icon: Shield,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
  ];

  const recentActivity = [
    { location: 'Marché Central → Gombe', time: '2h', price: 35 },
    { location: 'Université → Aéroport', time: '1j', price: 75 },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-yellow-500 pt-16 pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 mb-8">
            <View className="flex-1">
              <Text className="text-white text-2xl font-montserrat-bold">
                {greeting} !
              </Text>
              <Text className="text-white/90 font-montserrat text-lg mt-1">
                {user?.fullname || 'Cher client'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(client)/profile')}>
              <AvatarPlaceholder 
                name={user?.fullname || user?.phone || 'Client'}
                avatar={user?.avatar}
                size={50}
              />
            </TouchableOpacity>
          </View>

          {/* Welcome Message */}
          <View className="px-6 mb-8">
            <Text className="text-white text-xl font-montserrat-bold mb-2">
              Où souhaitez-vous aller ?
            </Text>
            <Text className="text-white/90 font-montserrat">
              Trouvez le transporteur parfait pour vos besoins
            </Text>
          </View>

          {/* Stats Cards */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="px-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {stats.map((stat, index) => (
              <View 
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mr-4 items-center"
                style={{ width: 100 }}
              >
                <View className={`w-10 h-10 ${stat.color} rounded-full items-center justify-center mb-2`}>
                  <stat.icon size={20} color="white" />
                </View>
                <Text className="text-white font-montserrat-bold text-lg">
                  {stat.label}
                </Text>
                <Text className="text-white/80 font-montserrat text-xs text-center">
                  {stat.subtitle}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Services Section */}
        {/* <View className="px-6 py-8">
          <Text className="text-gray-800 text-xl font-montserrat-bold mb-6">
            Nos services
          </Text>
          
          <View className="space-y-4">
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push('/(client)/booking')}
                className={`${service.color} rounded-xl p-6 shadow-lg`}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                    <service.icon size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-montserrat-bold text-lg">
                      {service.title}
                    </Text>
                    <Text className="text-white/90 font-montserrat text-sm mt-1">
                      {service.description}
                    </Text>
                  </View>
                  <Text className="text-white text-2xl">›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Recent Activity */}
        <View className="px-6 py-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-800 text-xl font-montserrat-bold">
              Activité récente
            </Text>
            <TouchableOpacity onPress={() => router.push('/(client)/history')}>
              <Text className="text-yellow-500 font-montserrat-medium">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity.length > 0 ? (
            <View className="space-y-3">
              {recentActivity.map((activity, index) => (
                <View key={index} className="bg-white rounded-xl p-4 shadow-sm mb-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <MapPin size={16} color="#f59e0b" />
                        <Text className="text-gray-800 font-montserrat-medium ml-2">
                          {activity.location}
                        </Text>
                      </View>
                      <Text className="text-gray-500 font-montserrat text-sm">
                        Il y a {activity.time}
                      </Text>
                    </View>
                    <Text className="text-green-600 font-montserrat-bold">
                      ${activity.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Clock size={32} color="#9ca3af" />
              </View>
              <Text className="text-gray-500 font-montserrat-medium text-lg mb-2">
                Aucune course récente
              </Text>
              <Text className="text-gray-400 font-montserrat text-center">
                Vos courses apparaîtront ici
              </Text>
            </View>
          )}
        </View>

        {/* Why Choose Us */}
        <View className="px-6 pb-8 mb-12">
          <Text className="text-gray-800 text-xl font-montserrat-bold mb-6">
            Pourquoi T'chukudu ?
          </Text>
          
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <View className="space-y-4">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Shield size={20} color="#16a34a" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold">
                    Transporteurs vérifiés
                  </Text>
                  <Text className="text-gray-600 font-montserrat text-sm">
                    Tous nos transporteurs sont contrôlés
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <TrendingUp size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold">
                    Prix transparents
                  </Text>
                  <Text className="text-gray-600 font-montserrat text-sm">
                    Pas de frais cachés, prix fixés à l'avance
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-4">
                  <MapPin size={20} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold">
                    Suivi en temps réel
                  </Text>
                  <Text className="text-gray-600 font-montserrat text-sm">
                    Suivez votre course en direct sur la carte
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/(client)/booking')}
        className="absolute bottom-6 flex-row right-6 bg-yellow-500 w- px-3 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#f59e0b',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <CarFrontIcon size={28} color="white" />
        <Text className="text-white font-montserrat-bold text-lg">
          Réservez
        </Text>
      </TouchableOpacity>
    </View>
  );
}