import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAppContext } from '@/contexts/AppContext';
import { User, Phone, Mail, Camera, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';

interface ProfileForm {
  fullname: string;
  email: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function EditProfileScreen() {
  const { user, setUser } = useAppContext();
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.avatar || undefined);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      fullname: user?.fullname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const newPassword = watch('newPassword');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: pickImage },
        { text: 'Caméra', onPress: takePhoto },
      ]
    );
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    
    // Validation du mot de passe si changement demandé
    if (changePassword) {
      if (!data.currentPassword) {
        showToast('error', 'Mot de passe actuel requis');
        return;
      }
      if (!data.newPassword || data.newPassword.length < 6) {
        showToast('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        showToast('error', 'Les mots de passe ne correspondent pas');
        return;
      }
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(async () => {
      const updatedUser = {
        ...user,
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        avatar: profileImage,
        isProfileComplete: true,
      };
      
      await setUser(updatedUser);
      setLoading(false);
      showToast('success', changePassword ? 'Profil et mot de passe mis à jour !' : 'Profil mis à jour !');
      router.back();
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-yellow-500">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-montserrat-bold">
          Modifier le profil
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Mettez à jour vos informations
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Profile Photo */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={showImagePicker} className="relative">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <AvatarPlaceholder 
                name={user?.fullname || 'Transporteur'}
                size={96}
              />
            )}
            <View className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-500 rounded-full items-center justify-center">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-gray-600 font-montserrat text-sm mt-2">
            Touchez pour changer la photo
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white rounded-xl p-4 space-y-4">
          {/* Full Name */}
          <View>
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
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
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
          <View>
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
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm font-montserrat mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Phone */}
          <View>
            <View className="flex-row items-center mb-2">
              <Phone size={16} color="#f59e0b" />
              <Text className="text-gray-700 font-montserrat-medium ml-2">
                Téléphone
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
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                />
              )}
            />
            {errors.phone && (
              <Text className="text-red-500 text-sm font-montserrat mt-1">
                {errors.phone.message}
              </Text>
            )}
          </View>
        </View>

        {/* Password Section */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-800 font-montserrat-bold text-lg">
              Sécurité
            </Text>
            <TouchableOpacity
              onPress={() => {
                setChangePassword(!changePassword);
                if (!changePassword) {
                  // Reset password fields when enabling
                  reset({
                    ...watch(),
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }
              }}
              className={`px-3 py-1 rounded-full ${
                changePassword ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
            >
              <Text className={`font-montserrat-medium text-sm ${
                changePassword ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {changePassword ? 'Annuler' : 'Changer mot de passe'}
              </Text>
            </TouchableOpacity>
          </View>

          {changePassword && (
            <View className="space-y-4">
              {/* Current Password */}
              <View>
                <View className="flex-row items-center mb-2">
                  <Lock size={16} color="#f59e0b" />
                  <Text className="text-gray-700 font-montserrat-medium ml-2">
                    Mot de passe actuel
                  </Text>
                </View>
                <View className="relative">
                  <Controller
                    control={control}
                    name="currentPassword"
                    rules={changePassword ? { required: 'Mot de passe actuel requis' } : {}}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Votre mot de passe actuel"
                        secureTextEntry={!showCurrentPassword}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 pr-12 text-gray-800 font-montserrat"
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.currentPassword && (
                  <Text className="text-red-500 text-sm font-montserrat mt-1">
                    {errors.currentPassword.message}
                  </Text>
                )}
              </View>

              {/* New Password */}
              <View>
                <View className="flex-row items-center mb-2">
                  <Lock size={16} color="#f59e0b" />
                  <Text className="text-gray-700 font-montserrat-medium ml-2">
                    Nouveau mot de passe
                  </Text>
                </View>
                <View className="relative">
                  <Controller
                    control={control}
                    name="newPassword"
                    rules={changePassword ? { 
                      required: 'Nouveau mot de passe requis',
                      minLength: { value: 6, message: 'Minimum 6 caractères' }
                    } : {}}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Votre nouveau mot de passe"
                        secureTextEntry={!showNewPassword}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 pr-12 text-gray-800 font-montserrat"
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.newPassword && (
                  <Text className="text-red-500 text-sm font-montserrat mt-1">
                    {errors.newPassword.message}
                  </Text>
                )}
              </View>

              {/* Confirm Password */}
              <View>
                <View className="flex-row items-center mb-2">
                  <Lock size={16} color="#f59e0b" />
                  <Text className="text-gray-700 font-montserrat-medium ml-2">
                    Confirmer le nouveau mot de passe
                  </Text>
                </View>
                <View className="relative">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    rules={changePassword ? { 
                      required: 'Confirmation requise',
                      validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
                    } : {}}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Confirmer le nouveau mot de passe"
                        secureTextEntry={!showConfirmPassword}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 pr-12 text-gray-800 font-montserrat"
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm font-montserrat mt-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`py-4 px-6 rounded-xl mt-6 ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {loading ? 'Mise à jour...' : 'Sauvegarder'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}