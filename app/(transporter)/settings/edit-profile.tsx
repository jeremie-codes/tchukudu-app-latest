import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAppContext } from '@/contexts/AppContext';
import { 
  User, Phone, Mail, Camera, ArrowLeft, Lock, Eye, EyeOff, 
  Calendar, FileText, Building, Globe
} from 'lucide-react-native';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';
import { TransporterUser } from '@/types';

interface ProfileForm {
  // Informations de base
  fullname: string;
  email: string;
  phone: string;
  
  // Permis de conduire
  driverLicenseNumber?: string;
  driverLicenseCategory?: string;
  driverLicenseIssueDate?: string;
  driverLicenseExpiry?: string;
  
  // Informations professionnelles
  yearsOfExperience?: string;
  languagesSpoken?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  
  // Sécurité
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function EditProfileScreen() {
  const { user, setUser } = useAppContext();
  const transporterUser = user as TransporterUser;
  
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.avatar || undefined);
  const [driverLicenseImage, setDriverLicenseImage] = useState<string | undefined>(transporterUser?.driverLicenseImage || undefined);
  
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'license' | 'professional' | 'security'>('basic');
  
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      // Informations de base
      fullname: user?.fullname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      
      // Permis de conduire
      driverLicenseNumber: transporterUser?.driverLicenseNumber || '',
      driverLicenseCategory: transporterUser?.driverLicenseCategory || '',
      driverLicenseIssueDate: transporterUser?.driverLicenseIssueDate || '',
      driverLicenseExpiry: transporterUser?.driverLicenseExpiry || '',
      
      // Informations professionnelles
      yearsOfExperience: transporterUser?.yearsOfExperience?.toString() || '',
      languagesSpoken: transporterUser?.languagesSpoken?.join(', ') || '',
      workingHoursStart: transporterUser?.workingHours?.start || '',
      workingHoursEnd: transporterUser?.workingHours?.end || '',
      
      // Sécurité
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const newPassword = watch('newPassword');

  const pickImage = async (imageType: 'profile' | 'license') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: imageType === 'profile' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      switch (imageType) {
        case 'profile':
          setProfileImage(result.assets[0].uri);
          break;
        case 'license':
          setDriverLicenseImage(result.assets[0].uri);
          break;
      }
    }
  };

  const takePhoto = async (imageType: 'profile' | 'license') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: imageType === 'profile' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      switch (imageType) {
        case 'profile':
          setProfileImage(result.assets[0].uri);
          break;
        case 'license':
          setDriverLicenseImage(result.assets[0].uri);
          break;
      }
    }
  };

  const showImagePicker = (imageType: 'profile' | 'license', title: string) => {
    Alert.alert(
      title,
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => pickImage(imageType) },
        { text: 'Caméra', onPress: () => takePhoto(imageType) },
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
      const updatedUser: TransporterUser = {
        ...transporterUser,
        // Informations de base
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        avatar: profileImage,
        
        // Permis de conduire
        driverLicenseNumber: data.driverLicenseNumber,
        driverLicenseCategory: data.driverLicenseCategory,
        driverLicenseIssueDate: data.driverLicenseIssueDate,
        driverLicenseExpiry: data.driverLicenseExpiry,
        driverLicenseImage: driverLicenseImage,
        
        // Informations professionnelles
        yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : undefined,
        languagesSpoken: data.languagesSpoken ? data.languagesSpoken.split(',').map(lang => lang.trim()) : undefined,
        workingHours: data.workingHoursStart && data.workingHoursEnd ? {
          start: data.workingHoursStart,
          end: data.workingHoursEnd
        } : undefined,
        
        isProfileComplete: true,
      };
      
      await setUser(updatedUser);
      setLoading(false);
      showToast('success', changePassword ? 'Profil et mot de passe mis à jour !' : 'Profil mis à jour !');
      router.back();
    }, 1000);
  };

  const sections = [
    { key: 'basic', label: 'Informations de base', icon: User },
    { key: 'license', label: 'Permis de conduire', icon: FileText },
    { key: 'professional', label: 'Informations professionnelles', icon: Building },
    { key: 'security', label: 'Sécurité', icon: Lock },
  ];

  const renderImagePicker = (
    imageUri: string | undefined,
    onPress: () => void,
    placeholder: string
  ) => (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 items-center justify-center"
      style={{ minHeight: 120 }}
    >
      {imageUri ? (
        <View className="relative w-full">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-24 rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full items-center justify-center">
            <Camera size={12} color="white" />
          </View>
        </View>
      ) : (
        <View className="items-center">
          <Camera size={24} color="#6b7280" />
          <Text className="text-gray-600 font-montserrat text-sm mt-2 text-center">
            {placeholder}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderBasicSection = () => (
    <View className="space-y-4">
      {/* Profile Photo */}
      <View className="items-center mb-6">
        <TouchableOpacity onPress={() => showImagePicker('profile', 'Photo de profil')} className="relative">
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

      {/* Full Name */}
      <View>
        <View className="flex-row items-center mb-2">
          <User size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Nom complet *
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
            Email *
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
            Téléphone *
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
  );

  const renderLicenseSection = () => (
    <View className="space-y-4">
      {/* Driver License Number */}
      <View>
        <View className="flex-row items-center mb-2">
          <FileText size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Numéro du permis de conduire
          </Text>
        </View>
        <Controller
          control={control}
          name="driverLicenseNumber"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Numéro de votre permis"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>

      {/* Driver License Category */}
      <View>
        <View className="flex-row items-center mb-2">
          <FileText size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Catégorie du permis
          </Text>
        </View>
        <Controller
          control={control}
          name="driverLicenseCategory"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ex: A, B, C, D"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>

      {/* Driver License Issue Date */}
      <View>
        <View className="flex-row items-center mb-2">
          <Calendar size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Date de délivrance
          </Text>
        </View>
        <Controller
          control={control}
          name="driverLicenseIssueDate"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="YYYY-MM-DD"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>

      {/* Driver License Expiry */}
      <View>
        <View className="flex-row items-center mb-2">
          <Calendar size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Date d'expiration
          </Text>
        </View>
        <Controller
          control={control}
          name="driverLicenseExpiry"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="YYYY-MM-DD"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>

      {/* Driver License Image */}
      <View>
        <Text className="text-gray-700 font-montserrat-medium mb-2">
          Photo du permis de conduire
        </Text>
        {renderImagePicker(
          driverLicenseImage,
          () => showImagePicker('license', 'Photo du permis de conduire'),
          'Ajouter une photo de votre permis'
        )}
      </View>
    </View>
  );

  const renderProfessionalSection = () => (
    <View className="space-y-4">
      {/* Years of Experience */}
      <View>
        <View className="flex-row items-center mb-2">
          <Building size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Années d'expérience
          </Text>
        </View>
        <Controller
          control={control}
          name="yearsOfExperience"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ex: 5"
              keyboardType="numeric"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>

      {/* Languages Spoken */}
      <View>
        <View className="flex-row items-center mb-2">
          <Globe size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Langues parlées
          </Text>
        </View>
        <Controller
          control={control}
          name="languagesSpoken"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ex: Français, Lingala, Anglais"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
        <Text className="text-gray-500 font-montserrat text-xs mt-1">
          Séparez les langues par des virgules
        </Text>
      </View>

      {/* Working Hours Start */}
      <View>
        <View className="flex-row items-center mb-2">
          <Calendar size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Heure de début de travail
          </Text>
        </View>
        <Controller
          control={control}
          name="workingHoursStart"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ex: 08:00"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>

      {/* Working Hours End */}
      <View>
        <View className="flex-row items-center mb-2">
          <Calendar size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Heure de fin de travail
          </Text>
        </View>
        <Controller
          control={control}
          name="workingHoursEnd"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ex: 18:00"
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
            />
          )}
        />
      </View>
    </View>
  );

  const renderSecuritySection = () => (
    <View className="space-y-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-gray-800 font-montserrat-bold text-lg">
          Changer le mot de passe
        </Text>
        <TouchableOpacity
          onPress={() => {
            setChangePassword(!changePassword);
            if (!changePassword) {
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
            {changePassword ? 'Annuler' : 'Modifier'}
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
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic': return renderBasicSection();
      case 'license': return renderLicenseSection();
      case 'professional': return renderProfessionalSection();
      case 'security': return renderSecuritySection();
      default: return renderBasicSection();
    }
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
          Mettez à jour vos informations essentielles
        </Text>
      </View>

      {/* Section Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200 h-16"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View className="flex-row gap-x-3 h-16">
          {sections.map((section) => (
            <TouchableOpacity
              key={section.key}
              onPress={() => setActiveSection(section.key as any)}
              className={`px-4 py-2 rounded-full border flex-row items-center h-12 ${
                activeSection === section.key
                  ? 'bg-yellow-500 border-yellow-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <section.icon 
                size={16} 
                color={activeSection === section.key ? 'white' : '#6b7280'} 
              />
              <Text className={`font-montserrat-medium text-sm ml-2 ${
                activeSection === section.key ? 'text-white' : 'text-gray-600'
              }`}>
                {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView className="px-6 py-6">
        <View className="bg-white rounded-xl p-4 mb-6">
          {renderActiveSection()}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`py-4 px-6 rounded-xl ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`}
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {loading ? 'Mise à jour...' : 'Sauvegarder'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}