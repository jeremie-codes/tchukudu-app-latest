import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Star, DollarSign, MessageSquare } from 'lucide-react-native';
import { getRideHistory } from '@/api/rides';
import RatingModal from '@/components/RatingModal';

interface Ride {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  transporter: string;
  vehicle: string;
  price: number;
  status: 'completed' | 'cancelled';
  rating?: number;
  comment?: string;
  canRate?: boolean;
  ratedAt?: string;
}

export default function HistoryScreen() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getRideHistory();
      // Add rating capability for completed rides without rating
      const ridesWithRatingInfo = data.map(ride => ({
        ...ride,
        canRate: ride.status === 'completed' && !ride.rating
      }));
      setRides(ridesWithRatingInfo);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateRide = (ride: Ride) => {
    setSelectedRide(ride);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rideId: string, rating: number, comment: string, criteria: any) => {
    // Update the ride in the list
    setRides(prevRides => 
      prevRides.map(ride => 
        ride.id === rideId 
          ? { 
              ...ride, 
              rating, 
              comment, 
              canRate: false,
              ratedAt: new Date().toLocaleDateString('fr-FR')
            }
          : ride
      )
    );
    
    // In production, this would be an API call
    // await submitRating(rideId, rating, comment, criteria);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <Text className="text-white text-2xl font-montserrat-bold">
          Historique
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Vos courses précédentes
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-500 font-montserrat">
              Chargement...
            </Text>
          </View>
        ) : rides.length === 0 ? (
          <View className="items-center py-12">
            <Clock size={48} color="#9ca3af" />
            <Text className="text-gray-500 font-montserrat-medium text-lg mt-4">
              Aucune course
            </Text>
            <Text className="text-gray-400 font-montserrat text-center mt-2">
              Vos courses apparaîtront ici une fois que vous en aurez effectué
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {rides.map((ride) => (
              <TouchableOpacity key={ride.id} className="bg-white rounded-xl p-4 mb-3 shadow-xl">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-800 font-montserrat-bold text-lg">
                      {ride.transporter}
                    </Text>
                    <Text className="text-gray-600 font-montserrat">
                      {ride.vehicle} • {ride.date}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(ride.status)}`}>
                    <Text className={`font-montserrat-medium text-sm ${getStatusColor(ride.status).split(' ')[0]}`}>
                      {getStatusText(ride.status)}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2 mb-3">
                  <View className="flex-row items-center">
                    <MapPin size={16} color="#6b7280" />
                    <Text className="text-gray-600 font-montserrat ml-2 flex-1">
                      De: {ride.pickup}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MapPin size={16} color="#f59e0b" />
                    <Text className="text-gray-600 font-montserrat ml-2 flex-1">
                      Vers: {ride.destination}
                    </Text>
                  </View>
                </View>

                {/* Rating Section */}
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center">
                    <DollarSign size={16} color="#16a34a" />
                    <Text className="text-green-600 font-montserrat-bold ml-1">
                      ${ride.price}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    {ride.rating ? (
                      <View className="flex-row items-center">
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-gray-600 font-montserrat ml-1">
                          {ride.rating}/5
                        </Text>
                        {ride.comment && (
                          <MessageSquare size={14} color="#6b7280" className="ml-2" />
                        )}
                      </View>
                    ) : ride.canRate ? (
                      <TouchableOpacity
                        onPress={() => handleRateRide(ride)}
                        className="bg-yellow-500 px-3 py-1 rounded-full"
                      >
                        <Text className="text-white font-montserrat-medium text-sm">
                          Évaluer
                        </Text>
                      </TouchableOpacity>
                    ) : ride.status === 'cancelled' ? (
                      <Text className="text-gray-400 font-montserrat text-sm">
                        Course annulée
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Rating Details */}
                {ride.rating && ride.comment && (
                  <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-gray-600 font-montserrat text-sm italic">
                      "{ride.comment}"
                    </Text>
                    {ride.ratedAt && (
                      <Text className="text-gray-400 font-montserrat text-xs mt-1">
                        Évalué le {ride.ratedAt}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Rating Modal */}
      {selectedRide && (
        <RatingModal
          visible={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedRide(null);
          }}
          ride={selectedRide}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </View>
  );
}