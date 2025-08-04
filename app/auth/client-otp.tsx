import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { generateRandomAvatar } from '@/utils/avatar';
import { showToast } from '@/utils/toast';
import uuid from 'react-native-uuid';

export default function ClientOTPScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { setUser } = useAppContext();

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      showToast('error', 'Veuillez entrer le code à 4 chiffres');
      return;
    }

    setLoading(true);
    
    // Simulate OTP verification (always accepts 1234)
    setTimeout(async () => {
      if (otp === '1234') {
        const newUser = {
          id: uuid.v4() as string,
          phone: phone || '',
          type: 'client' as const,
          avatar: generateRandomAvatar(),
          isProfileComplete: false,
        };
        
        await setUser(newUser);
        setLoading(false);
        showToast('success', 'Connexion réussie !');
        router.replace('/(client)');
      } else {
        setLoading(false);
        showToast('error', 'Code incorrect. Essayez 1234');
      }
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
          Vérification
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Code envoyé au {phone}
        </Text>
      </View>

      <View className="flex-1 px-6 py-8">
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Shield size={20} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Code de vérification
            </Text>
          </View>
          
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="1234"
            keyboardType="numeric"
            maxLength={4}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 font-montserrat text-2xl text-center tracking-widest"
          />
        </View>

        <TouchableOpacity
          onPress={handleVerifyOTP}
          disabled={loading}
          className={`py-4 px-6 rounded-xl ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {loading ? 'Vérification...' : 'Vérifier'}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-sm font-montserrat text-center mt-6">
          Code de test : 1234
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4"
        >
          <Text className="text-yellow-500 font-montserrat text-center">
            Changer de numéro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}