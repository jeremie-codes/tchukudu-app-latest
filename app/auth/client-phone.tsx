import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { showToast } from '@/utils/toast';

export default function ClientPhoneScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserType } = useAppContext();

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      showToast('error', 'Veuillez entrer un numéro valide');
      return;
    }

    setLoading(true);
    setUserType('client');
    
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      showToast('success', 'Code OTP envoyé !');
      router.push({ pathname: '/auth/client-otp', params: { phone } });
    }, 1000);
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
          Connexion Client
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Entrez votre numéro de téléphone
        </Text>
      </View>

      <View className="flex-1 px-6 py-8">
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Phone size={20} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Numéro de téléphone
            </Text>
          </View>
          
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+243 XXX XXX XXX"
            keyboardType="phone-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 font-montserrat"
          />
        </View>

        <TouchableOpacity
          onPress={handleSendOTP}
          disabled={loading}
          className={`py-4 px-6 rounded-xl ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {loading ? 'Envoi...' : 'Envoyer le code'}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-sm font-montserrat text-center mt-6">
          Vous recevrez un code de vérification par SMS
        </Text>
      </View>
    </View>
  );
}