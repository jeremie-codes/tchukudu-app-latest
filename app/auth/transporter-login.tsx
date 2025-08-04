import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Phone, Lock } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAppContext } from '@/contexts/AppContext';
import { showToast } from '@/utils/toast';

interface LoginForm {
  phone: string;
  password: string;
}

export default function TransporterLoginScreen() {
  const [loading, setLoading] = useState(false);
  const { setUser, setUserType } = useAppContext();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    
    // Simulate login
    setTimeout(async () => {
      const mockUser = {
        id: 'transporter-1',
        phone: data.phone,
        fullname: 'Jean Dupont',
        email: 'jean@example.com',
        type: 'transporter' as const,
        isProfileComplete: true,
      };
      
      await setUserType('transporter');
      await setUser(mockUser);
      setLoading(false);
      showToast('success', 'Connexion réussie !');
      router.replace('/(transporter)');
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
          Connexion Transporteur
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Connectez-vous à votre compte
        </Text>
      </View>

      <View className="flex-1 px-6 py-8">
        {/* Phone */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Phone size={16} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Numéro de téléphone
            </Text>
          </View>
          <Controller
            control={control}
            name="phone"
            rules={{ required: 'Numéro requis' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="+243 XXX XXX XXX"
                keyboardType="phone-pad"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-montserrat"
              />
            )}
          />
          {errors.phone && (
            <Text className="text-red-500 text-sm font-montserrat mt-1">
              {errors.phone.message}
            </Text>
          )}
        </View>

        {/* Password */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <Lock size={16} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Mot de passe
            </Text>
          </View>
          <Controller
            control={control}
            name="password"
            rules={{ required: 'Mot de passe requis' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Votre mot de passe"
                secureTextEntry
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-montserrat"
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm font-montserrat mt-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`py-4 px-6 rounded-xl ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/transporter-register')}
          className="mt-6"
        >
          <Text className="text-yellow-500 font-montserrat text-center">
            Pas encore de compte ? S'inscrire
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}