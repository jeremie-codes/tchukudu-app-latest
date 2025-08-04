import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { X, Star, MessageCircle, ThumbsUp, Clock, Shield, Car } from 'lucide-react-native';
import { showToast } from '@/utils/toast';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  ride: {
    id: string;
    transporter: string;
    vehicle: string;
    date: string;
    pickup: string;
    destination: string;
    price: number;
  };
  onRatingSubmit: (rideId: string, rating: number, comment: string, criteria: any) => void;
}

export default function RatingModal({ visible, onClose, ride, onRatingSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState({
    punctuality: 0,
    safety: 0,
    vehicle: 0,
    service: 0
  });
  const [loading, setLoading] = useState(false);

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const handleCriteriaPress = (criterion: keyof typeof criteria, value: number) => {
    setCriteria(prev => ({ ...prev, [criterion]: value }));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showToast('error', 'Veuillez donner une note globale');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onRatingSubmit(ride.id, rating, comment, criteria);
      setLoading(false);
      showToast('success', 'Évaluation envoyée avec succès !');
      onClose();
      
      // Reset form
      setRating(0);
      setComment('');
      setCriteria({ punctuality: 0, safety: 0, vehicle: 0, service: 0 });
    }, 1000);
  };

  const criteriaConfig = [
    { key: 'punctuality', label: 'Ponctualité', icon: Clock, color: 'text-blue-600' },
    { key: 'safety', label: 'Sécurité', icon: Shield, color: 'text-green-600' },
    { key: 'vehicle', label: 'État du véhicule', icon: Car, color: 'text-purple-600' },
    { key: 'service', label: 'Qualité du service', icon: ThumbsUp, color: 'text-orange-600' }
  ];

  const renderStars = (currentRating: number, onPress: (value: number) => void, size: number = 24) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onPress(star)}>
            <Star
              size={size}
              color={star <= currentRating ? "#fbbf24" : "#d1d5db"}
              fill={star <= currentRating ? "#fbbf24" : "transparent"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="pt-16 pb-6 px-6 bg-yellow-500">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-montserrat-bold">
              Évaluer le transporteur
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Ride Info */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-gray-800 font-montserrat-bold text-lg mb-2">
              {ride.transporter}
            </Text>
            <Text className="text-gray-600 font-montserrat mb-1">
              {ride.vehicle} • {ride.date}
            </Text>
            <Text className="text-gray-600 font-montserrat text-sm">
              {ride.pickup} → {ride.destination}
            </Text>
            <Text className="text-green-600 font-montserrat-bold mt-2">
              ${ride.price}
            </Text>
          </View>

          {/* Overall Rating */}
          <View className="mb-6">
            <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
              Note globale
            </Text>
            <View className="items-center">
              {renderStars(rating, handleStarPress, 32)}
              <Text className="text-gray-600 font-montserrat mt-2">
                {rating === 0 ? 'Touchez les étoiles pour noter' : 
                 rating === 1 ? 'Très insatisfait' :
                 rating === 2 ? 'Insatisfait' :
                 rating === 3 ? 'Correct' :
                 rating === 4 ? 'Satisfait' : 'Très satisfait'}
              </Text>
            </View>
          </View>

          {/* Detailed Criteria */}
          <View className="mb-6">
            <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
              Évaluation détaillée
            </Text>
            
            <View className="space-y-4">
              {criteriaConfig.map((criterion) => (
                <View key={criterion.key} className="bg-white rounded-xl p-4 border border-gray-100">
                  <View className="flex-row items-center mb-3">
                    <criterion.icon size={20} color="#6b7280" />
                    <Text className="text-gray-800 font-montserrat-medium ml-2">
                      {criterion.label}
                    </Text>
                  </View>
                  {renderStars(
                    criteria[criterion.key as keyof typeof criteria], 
                    (value) => handleCriteriaPress(criterion.key as keyof typeof criteria, value),
                    20
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Comment */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <MessageCircle size={20} color="#f59e0b" />
              <Text className="text-gray-800 font-montserrat-bold text-lg ml-2">
                Commentaire (optionnel)
              </Text>
            </View>
            
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Partagez votre expérience pour aider les autres clients..."
              multiline
              numberOfLines={4}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-montserrat"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || rating === 0}
            className={`py-4 px-6 rounded-xl ${
              loading || rating === 0 ? 'bg-gray-300' : 'bg-yellow-500'
            }`}
          >
            <Text className="text-white text-lg font-montserrat-medium text-center">
              {loading ? 'Envoi en cours...' : 'Envoyer l\'évaluation'}
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-sm font-montserrat text-center mt-4">
            Votre évaluation aide à améliorer la qualité du service
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}