import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Check, Star, Zap } from 'lucide-react-native';
import { SubscriptionPlan, getSubscriptionPlans } from '@/api/payments';
import PaymentBottomSheet from './PaymentBottomSheet';

interface SubscriptionPlansProps {
  transporterId: string;
  onSubscriptionSuccess: () => void;
}

export default function SubscriptionPlans({ transporterId, onSubscriptionSuccess }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    onSubscriptionSuccess();
    setShowPayment(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <View className="items-center py-8">
        <Text className="text-gray-500 font-montserrat">
          Chargement des plans...
        </Text>
      </View>
    );
  }

  return (
    <View className='bg-white h-screen'>
      <Text className="text-gray-800 font-montserrat-bold text-xl mb-6 text-center">
        Choisissez votre abonnement
      </Text>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row space-x-4 px-6">
            {plans.map((plan) => (
              <View
                key={plan.id}
                className={`w-72 bg-white rounded-xl p-6 border-2 ${
                  plan.popular ? 'border-yellow-500' : 'border-gray-200'
                } relative`}
              >
                {plan.popular && (
                  <View className="self-center  bg-yellow-500 px-4 py-1 rounded-full">
                    <View className="flex-row items-center">
                      <Star size={14} color="white" fill="white" />
                      <Text className="text-white font-montserrat-bold text-xs ml-1">
                        POPULAIRE
                      </Text>
                    </View>
                  </View>
                )}

                <View className="items-center mb-6">
                  <Text className="text-gray-800 font-montserrat-bold text-2xl">
                    {plan.name}
                  </Text>
                  <View className="flex-row items-baseline mt-2">
                    <Text className="text-yellow-500 font-montserrat-bold text-4xl">
                      ${plan.price}
                    </Text>
                    <Text className="text-gray-500 font-montserrat ml-1">
                      /{plan.duration}j
                    </Text>
                  </View>
                </View>

                <View className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <View key={index} className="flex-row items-center">
                      <View className="w-5 h-5 bg-green-100 rounded-full items-center justify-center mr-3">
                        <Check size={12} color="#16a34a" />
                      </View>
                      <Text className="text-gray-700 font-montserrat flex-1">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => handleSelectPlan(plan)}
                  className={`py-4 px-6 rounded-xl ${
                    plan.popular ? 'bg-yellow-500' : 'bg-gray-800'
                  }`}
                >
                  <Text className="text-white font-montserrat-bold text-center">
                    Choisir ce plan
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="px-6">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Zap size={20} color="#3b82f6" />
              <Text className="text-blue-800 font-montserrat-bold ml-2">
                Pourquoi s'abonner ?
              </Text>
            </View>
            <Text className="text-blue-700 font-montserrat text-sm">
              L'abonnement vous donne accès à toutes les courses disponibles, 
              au support prioritaire et aux outils avancés pour maximiser vos revenus.
            </Text>
          </View>
        </View>

        <View className='flex-1'>
          <PaymentBottomSheet
            visible={showPayment}
            onClose={() => setShowPayment(false)}
            selectedPlan={selectedPlan}
            transporterId={transporterId}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </View>
      </View>
    </View>
  );
}