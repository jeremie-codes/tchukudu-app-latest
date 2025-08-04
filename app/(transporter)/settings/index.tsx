import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { User, Phone, Mail, CreditCard, LogOut, Shield, Truck, Settings as SettingsIcon, CreditCard as Edit, Plus } from 'lucide-react-native';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';

export default function TransporterSettingsScreen() {
  const { user, logout, hasSubscription, setHasSubscription, vehicle } = useAppContext();

  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);

  const handleSubscriptionSuccess = async () => {
    await setHasSubscription(true);
    setShowSubscriptionPlans(false);
    showToast('success', 'Abonnement activé avec succès !');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  const settingsOptions = [
    {
      title: 'Modifier le profil',
      description: 'Nom, email, photo de profil',
      icon: Edit,
      onPress: () => router.push('/(transporter)/settings/edit-profile'),
      showArrow: true
    },
    {
      title: 'Mon véhicule',
      description: vehicle ? `${vehicle.model} - ${vehicle.licensePlate}` : 'Ajouter un véhicule',
      icon: Truck,
      onPress: () => router.push('/(transporter)/settings/config'),
      showArrow: true
    },
    {
      title: 'Notifications',
      description: 'Gérer les notifications de courses',
      icon: Shield,
      onPress: () => {},
      showSwitch: true,
      switchValue: true
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <Text className="text-white text-2xl font-montserrat-bold">
          Paramètres
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Gérez votre compte transporteur
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Profile Card */}
        <View className="bg-white rounded-xl p-6 mb-6">
          <View className="items-center mb-4">
            <AvatarPlaceholder 
              name={user?.fullname || 'Transporteur'}
              avatar={user?.avatar}
              size={80}
            />
            <Text className="text-gray-800 font-montserrat-bold text-xl mt-4">
              {user?.fullname}
            </Text>
            <Text className="text-gray-600 font-montserrat">
              Transporteur T'chukudu
            </Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <Phone size={16} color="#6b7280" />
              <Text className="text-gray-600 font-montserrat ml-2">
                {user?.phone}
              </Text>
            </View>
            {user?.email && (
              <View className="flex-row items-center">
                <Mail size={16} color="#6b7280" />
                <Text className="text-gray-600 font-montserrat ml-2">
                  {user.email}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Subscription Status */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <CreditCard size={20} color="#f59e0b" />
                <Text className="text-gray-800 font-montserrat-bold text-lg ml-2">
                  Abonnement
                </Text>
              </View>
              <Text className="text-gray-600 font-montserrat">
                {hasSubscription ? 'Actif - Accès complet' : 'Inactif - Accès limité'}
              </Text>
              {hasSubscription && (
                <Text className="text-green-600 font-montserrat text-sm mt-1">
                  Expire le 31 janvier 2025
                </Text>
              )}
            </View>
            <View className={`w-3 h-3 rounded-full ${hasSubscription ? 'bg-green-500' : 'bg-red-500'}`} />
          </View>
          
          {!hasSubscription && (
            <TouchableOpacity
              onPress={() => setShowSubscriptionPlans(true)}
              className="bg-yellow-500 py-3 px-4 rounded-lg mt-4 flex-row items-center justify-center"
            >
              <Plus size={20} color="white" />
              <Text className="text-white font-montserrat-medium text-center">
                Souscrire maintenant
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings Options */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
            Configuration
          </Text>
          
          <View className="space-y-4">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center flex-1">
                  <option.icon size={20} color="#6b7280" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-montserrat-medium">
                      {option.title}
                    </Text>
                    <Text className="text-gray-500 font-montserrat text-sm">
                      {option.description}
                    </Text>
                  </View>
                </View>
                {option.showSwitch && (
                  <Switch
                    value={option.switchValue}
                    trackColor={{ false: '#e5e7eb', true: '#fbbf24' }}
                    thumbColor="#ffffff"
                  />
                )}
                {option.showArrow && (
                  <Text className="text-gray-400 font-montserrat text-lg">›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white border border-red-200 rounded-xl p-4 flex-row items-center justify-center mb-12"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="text-red-600 font-montserrat-medium ml-2">
            Se déconnecter
          </Text>
        </TouchableOpacity>

      </ScrollView>
      {/* Subscription Plans Modal */}
      {showSubscriptionPlans && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center border">
          <View className="bg-white rounded-xl m-4 max-h-96 w-full">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-gray-800 font-montserrat-bold text-lg">
                Plans d'abonnement
              </Text>
              <TouchableOpacity onPress={() => setShowSubscriptionPlans(false)}>
                <Text className="text-gray-500 font-montserrat text-2xl">×</Text>
              </TouchableOpacity>
            </View>
            <View className="">
              <SubscriptionPlans
                transporterId={user?.id || ''}
                onSubscriptionSuccess={handleSubscriptionSuccess}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}