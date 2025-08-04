import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { DollarSign, TrendingUp, Calendar, Clock, Star } from 'lucide-react-native';

export default function EarningsScreen() {
  const { user } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const stats = {
    today: {
      earnings: 127,
      rides: 5,
      hours: 6.5,
      rating: 4.8
    },
    week: {
      earnings: 890,
      rides: 32,
      hours: 45,
      rating: 4.7
    },
    month: {
      earnings: 3420,
      rides: 128,
      hours: 180,
      rating: 4.8
    }
  };

  const currentStats = stats[selectedPeriod];

  const recentEarnings = [
    { id: '1', client: 'Pierre Mukendi', amount: 35, date: '15 Jan', time: '14:30' },
    { id: '2', client: 'Marie Kabila', amount: 25, date: '15 Jan', time: '12:15' },
    { id: '3', client: 'Joseph Tshisekedi', amount: 67, date: '14 Jan', time: '16:45' },
  ];

  const periods = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <Text className="text-white text-2xl font-montserrat-bold">
          Mes gains
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Suivez vos revenus et performances
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Period Selector */}
        <View className="px-6 py-4">
          <View className="flex-row bg-white rounded-xl p-1">
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                onPress={() => setSelectedPeriod(period.key as any)}
                className={`flex-1 py-2 px-3 rounded-lg justify-center ${
                  selectedPeriod === period.key ? 'bg-yellow-500' : 'bg-transparent'
                }`}
              >
                <Text className={`font-montserrat-medium text-center ${
                  selectedPeriod === period.key ? 'text-white' : 'text-gray-600'
                }`}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 pb-6">
          <View className="grid grid-cols-2 gap-4">
            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <DollarSign size={20} color="#16a34a" />
                <Text className="text-gray-600 font-montserrat ml-2">
                  Revenus
                </Text>
              </View>
              <Text className="text-green-600 font-montserrat-bold text-2xl">
                ${currentStats.earnings}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Clock size={20} color="#3b82f6" />
                <Text className="text-gray-600 font-montserrat ml-2">
                  Courses
                </Text>
              </View>
              <Text className="text-blue-600 font-montserrat-bold text-2xl">
                {currentStats.rides}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <TrendingUp size={20} color="#f59e0b" />
                <Text className="text-gray-600 font-montserrat ml-2">
                  Heures
                </Text>
              </View>
              <Text className="text-yellow-600 font-montserrat-bold text-2xl">
                {currentStats.hours}h
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Star size={20} color="#fbbf24" />
                <Text className="text-gray-600 font-montserrat ml-2">
                  Note
                </Text>
              </View>
              <Text className="text-yellow-500 font-montserrat-bold text-2xl">
                {currentStats.rating}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Earnings */}
        <View className="px-6 pb-6">
          <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
            Gains récents
          </Text>
          
          <View className="bg-white rounded-xl">
            {recentEarnings.map((earning, index) => (
              <View 
                key={earning.id} 
                className={`p-4 flex-row items-center justify-between ${
                  index < recentEarnings.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold">
                    {earning.client}
                  </Text>
                  <Text className="text-gray-500 font-montserrat text-sm">
                    {earning.date} à {earning.time}
                  </Text>
                </View>
                <Text className="text-green-600 font-montserrat-bold text-lg">
                  +${earning.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Summary */}
        <View className="px-6 pb-8">
          <View className="bg-yellow-500 rounded-xl p-6">
            <Text className="text-white font-montserrat-bold text-lg mb-2">
              Performance {selectedPeriod === 'today' ? "d'aujourd'hui" : 
                         selectedPeriod === 'week' ? 'de la semaine' : 'du mois'}
            </Text>
            <Text className="text-white/90 font-montserrat">
              Vous avez gagné ${currentStats.earnings} avec {currentStats.rides} courses
            </Text>
            <Text className="text-white/90 font-montserrat">
              Moyenne: ${(currentStats.earnings / currentStats.rides).toFixed(0)} par course
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}