import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAppContext } from '@/contexts/AppContext';
import { Truck, Bike, CarTaxiFront, Package, ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react-native';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';

interface VehicleForm {
  type: string;
  model: string;
  licensePlate: string;
  capacity: string;
  pricePerKm: string;
  pricePerKg?: string;
}

export default function VehicleConfigScreen() {
  const { vehicle, setVehicle } = useAppContext();
  const [selectedType, setSelectedType] = useState(vehicle?.type || '');
  const [vehicleImage, setVehicleImage] = useState<string | null>(vehicle?.image || null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<VehicleForm>({
    defaultValues: {
      type: vehicle?.type || '',
      model: vehicle?.model || '',
      licensePlate: vehicle?.licensePlate || '',
      capacity: vehicle?.capacity?.toString() || '',
      pricePerKm: vehicle?.pricePerKm?.toString() || '',
      pricePerKg: vehicle?.pricePerKg?.toString() || '',
    }
  });

  const vehicleTypes = [
    { id: 'truck', name: 'Camion', icon: Truck, color: 'bg-blue-500' },
    { id: 'motorcycle', name: 'Moto', icon: Bike, color: 'bg-green-500' },
    { id: 'van', name: 'Fourgonnette', icon: Package, color: 'bg-purple-500' },
    { id: 'car', name: 'Voiture', icon: CarTaxiFront, color: 'bg-orange-500' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVehicleImage(result.assets[0].uri);
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
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Photo du véhicule',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: pickImage },
        { text: 'Caméra', onPress: takePhoto },
      ]
    );
  };

  const onSubmit = async (data: VehicleForm) => {
    if (!selectedType) {
      showToast('error', 'Veuillez sélectionner un type de véhicule');
      return;
    }

    const newVehicle = {
      id: vehicle?.id || uuid.v4() as string,
      type: selectedType as 'truck' | 'motorcycle' | 'van' | 'car',
      model: data.model,
      licensePlate: data.licensePlate,
      capacity: parseFloat(data.capacity),
      pricePerKm: parseFloat(data.pricePerKm),
      pricePerKg: data.pricePerKg ? parseFloat(data.pricePerKg) : undefined,
      image: vehicleImage,
    };

    // await setVehicle(newVehicle);
    showToast('success', 'Véhicule enregistré !');
    router.back();
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
          Configuration véhicule
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Gérez les détails de votre véhicule
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Vehicle Type Selection */}
        <View className="mb-6">
          <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
            Type de véhicule
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {vehicleTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                className={`border-2 rounded-xl p-3 items-center mb-4 ${
                  selectedType === type.id 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-gray-200 bg-white'
                }`}
                style={{ width: '48%' }}
              >
                <View className={`w-10 h-10 ${type.color} rounded-full items-center justify-center mb-2`}>
                  <type.icon size={20} color="white" />
                </View>
                <Text className="text-gray-800 font-montserrat-medium text-center">
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vehicle Photo */}
        <View className="mb-6">
          <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
            Photo du véhicule
          </Text>
          
          <TouchableOpacity 
            onPress={showImagePicker}
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 items-center justify-center"
            style={{ minHeight: 200 }}
          >
            {vehicleImage ? (
              <View className="relative w-full">
                <Image
                  source={{ uri: vehicleImage }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
                <View className="absolute top-2 right-2 w-8 h-8 bg-yellow-500 rounded-full items-center justify-center">
                  <Camera size={16} color="white" />
                </View>
              </View>
            ) : (
              <View className="items-center">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <ImageIcon size={32} color="#6b7280" />
                </View>
                <Text className="text-gray-600 font-montserrat-medium mb-2">
                  Ajouter une photo du véhicule
                </Text>
                <Text className="text-gray-500 font-montserrat text-sm text-center">
                  Touchez pour prendre une photo ou choisir depuis la galerie
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <Text className="text-gray-500 font-montserrat text-xs mt-2 text-center">
            Une photo claire de votre véhicule aide les clients à vous identifier
          </Text>
        </View>

        {/* Vehicle Details Form */}
        <View className="bg-white rounded-xl p-4 space-y-4">
          {/* Model */}
          <View>
            <Text className="text-gray-700 font-montserrat-medium mb-2">
              Modèle du véhicule
            </Text>
            <Controller
              control={control}
              name="model"
              rules={{ required: 'Modèle requis' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: Toyota Hilux"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                />
              )}
            />
            {errors.model && (
              <Text className="text-red-500 text-sm font-montserrat mt-1">
                {errors.model.message}
              </Text>
            )}
          </View>

          {/* License Plate */}
          <View>
            <Text className="text-gray-700 font-montserrat-medium mb-2">
              Plaque d'immatriculation
            </Text>
            <Controller
              control={control}
              name="licensePlate"
              rules={{ required: 'Plaque requise' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: ABC-123"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                />
              )}
            />
            {errors.licensePlate && (
              <Text className="text-red-500 text-sm font-montserrat mt-1">
                {errors.licensePlate.message}
              </Text>
            )}
          </View>

          {/* Capacity */}
          <View>
            <Text className="text-gray-700 font-montserrat-medium mb-2">
              Capacité {selectedType === 'car' ? '(passagers)' : '(kg)'}
            </Text>
            <Controller
              control={control}
              name="capacity"
              rules={{ required: 'Capacité requise' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={selectedType === 'car' ? "Ex: 4" : "Ex: 1000"}
                  keyboardType="numeric"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                />
              )}
            />
            {errors.capacity && (
              <Text className="text-red-500 text-sm font-montserrat mt-1">
                {errors.capacity.message}
              </Text>
            )}
          </View>

          {/* Price per KM */}
          <View>
            <Text className="text-gray-700 font-montserrat-medium mb-2">
              Prix par kilomètre ($)
            </Text>
            <Controller
              control={control}
              name="pricePerKm"
              rules={{ required: 'Prix par km requis' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: 2.5"
                  keyboardType="numeric"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                />
              )}
            />
            {errors.pricePerKm && (
              <Text className="text-red-500 text-sm font-montserrat mt-1">
                {errors.pricePerKm.message}
              </Text>
            )}
          </View>

          {/* Price per KG (for goods transport) */}
          {selectedType !== 'car' && (
            <View>
              <Text className="text-gray-700 font-montserrat-medium mb-2">
                Prix par kilogramme ($) - Optionnel
              </Text>
              <Controller
                control={control}
                name="pricePerKg"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ex: 0.5"
                    keyboardType="numeric"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 font-montserrat"
                  />
                )}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-yellow-500 py-4 px-6 rounded-xl mt-6 mb-10"
        >
          <Text className="text-white text-lg font-montserrat-medium text-center">
            {vehicle ? 'Mettre à jour' : 'Enregistrer le véhicule'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}