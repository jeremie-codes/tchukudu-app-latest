import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Phone, User, Mail, Lock } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAppContext } from '@/contexts/AppContext';
import { showToast } from '@/utils/toast';
import uuid from 'react-native-uuid';

interface RegisterForm {
  phone: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function TransporterRegisterScreen() {
  const [loading, setLoading] = useState(false);
  const { setUser, setUserType } = useAppContext();
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      showToast('error', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    
    // Simulate registration
    setTimeout(async () => {
      const newUser = {
        id: uuid.v4() as string,
        phone: data.phone,
        fullname: data.fullname,
        email: data.email,
        type: 'transporter' as const,
        isProfileComplete: false,
      };
      
      await setUserType('transporter');
      await setUser(newUser);
      setLoading(false);
      showToast('success', 'Compte créé avec succès !');
      router.replace('/(transporter)');
    }, 1500);
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
          Créer un compte
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Rejoignez notre réseau de transporteurs
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
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
            rules={{ 
              required: 'Numéro requis',
              minLength: { value: 10, message: 'Minimum 10 chiffres' }
            }}
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

        {/* Full Name */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <User size={16} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Nom complet
            </Text>
          </View>
          <Controller
            control={control}
            name="fullname"
            rules={{ required: 'Nom requis' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Votre nom complet"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-montserrat"
              />
            )}
          />
          {errors.fullname && (
            <Text className="text-red-500 text-sm font-montserrat mt-1">
              {errors.fullname.message}
            </Text>
          )}
        </View>

        {/* Email */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Mail size={16} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Email
            </Text>
          </View>
          <Controller
            control={control}
            name="email"
            rules={{ 
              required: 'Email requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-montserrat"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm font-montserrat mt-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Lock size={16} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Mot de passe
            </Text>
          </View>
          <Controller
            control={control}
            name="password"
            rules={{ 
              required: 'Mot de passe requis',
              minLength: { value: 6, message: 'Minimum 6 caractères' }
            }}
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

        {/* Confirm Password */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <Lock size={16} color="#f59e0b" />
            <Text className="text-gray-700 font-montserrat-medium ml-2">
              Confirmer le mot de passe
            </Text>
          </View>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ 
              required: 'Confirmation requise',
              validate: value => value === password || 'Les mots de passe ne correspondent pas'
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Confirmer le mot de passe"
                secureTextEntry
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-montserrat"
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm font-montserrat mt-1">
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`py-4 px-6 rounded-xl ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {loading ? 'Création...' : 'Créer mon compte'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}