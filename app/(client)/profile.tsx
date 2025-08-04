import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { User, Phone, CreditCard as Edit, LogOut } from 'lucide-react-native';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';

export default function ClientProfileScreen() {
  const { user, setUser, logout } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || '');

  const handleSave = async () => {
    if (user && fullname.trim()) {
      const updatedUser = { ...user, fullname: fullname.trim(), isProfileComplete: true };
      await setUser(updatedUser);
      setEditing(false);
      showToast('success', 'Profil mis à jour !');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <Text className="text-white text-2xl font-montserrat-bold">
          Mon Profil
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Gérez vos informations personnelles
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Profile Card */}
        <View className="bg-white rounded-xl p-6 mb-6">
          <View className="items-center mb-6">
            <AvatarPlaceholder 
              name={user?.fullname || user?.phone || 'Client'}
              avatar={user?.avatar}
              size={80}
            />
            <Text className="text-gray-800 font-montserrat-bold text-xl mt-4">
              {user?.fullname || 'Complétez votre profil'}
            </Text>
            <Text className="text-gray-600 font-montserrat">
              Client T'chukudu
            </Text>
          </View>

          {/* Profile Info */}
          <View className="space-y-4">
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <User size={16} color="#f59e0b" />
                  <Text className="text-gray-700 font-montserrat-medium ml-2">
                    Nom complet
                  </Text>
                </View>
                {!editing && (
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Edit size={16} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
              
              {editing ? (
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    value={fullname}
                    onChangeText={setFullname}
                    placeholder="Votre nom complet"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 font-montserrat"
                  />
                  <TouchableOpacity 
                    onPress={handleSave}
                    className="bg-yellow-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-montserrat-medium">
                      Sauver
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text className="text-gray-800 font-montserrat bg-gray-50 px-3 py-2 rounded-lg">
                  {user?.fullname || 'Non renseigné'}
                </Text>
              )}
            </View>

            <View>
              <View className="flex-row items-center mb-2">
                <Phone size={16} color="#f59e0b" />
                <Text className="text-gray-700 font-montserrat-medium ml-2">
                  Téléphone
                </Text>
              </View>
              <Text className="text-gray-800 font-montserrat bg-gray-50 px-3 py-2 rounded-lg">
                {user?.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white border border-red-200 rounded-xl p-4 flex-row items-center justify-center"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="text-red-600 font-montserrat-medium ml-2">
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}