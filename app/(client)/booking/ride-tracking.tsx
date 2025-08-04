import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, X, CreditCard } from 'lucide-react-native';
import AvatarPlaceholder from '@/components/AvatarPlaceholder';
import MapComponent from '@/components/MapComponent';
import PaymentBottomSheet from '@/components/PaymentBottomSheet';
import { showToast } from '@/utils/toast';
import * as Location from 'expo-location';

export default function RideTrackingScreen() {
  const [rideStatus, setRideStatus] = useState<'searching' | 'accepted' | 'pickup' | 'inProgress' | 'completed'>('searching');
  const [canCancel, setCanCancel] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [transporterLocation, setTransporterLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const { width, height } = Dimensions.get('window');

  const params = useLocalSearchParams<{
    transporterId: string;
    transporterName: string;
    transporterPhone: string;
    pickup: string;
    destination: string;
    price: string;
  }>();

  useEffect(() => {
    getCurrentLocation();
    simulateTransporterMovement();
    // Simulate ride progression
    const timer1 = setTimeout(() => setRideStatus('accepted'), 2000);
    const timer2 = setTimeout(() => setRideStatus('pickup'), 8000);
    const timer3 = setTimeout(() => setRideStatus('inProgress'), 15000);
    const timer4 = setTimeout(() => {
      setRideStatus('completed');
      setShowPayment(true);
    }, 25000);

    // Cancellation timer (5 minutes)
    const cancelTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanCancel(false);
          clearInterval(cancelTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(cancelTimer);
    };
  }, []);

  const simulateTransporterMovement = () => {
    if (!currentLocation) return;
    
    // Start transporter near current location
    let transporterLat = currentLocation.coords.latitude + 0.005;
    let transporterLng = currentLocation.coords.longitude + 0.005;
    
    setTransporterLocation({ latitude: transporterLat, longitude: transporterLng });
    
    // Simulate movement towards client
    const moveInterval = setInterval(() => {
      transporterLat -= 0.0002;
      transporterLng -= 0.0002;
      setTransporterLocation({ latitude: transporterLat, longitude: transporterLng });
    }, 2000);
    
    // Stop movement after 20 seconds
    setTimeout(() => clearInterval(moveInterval), 20000);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Annuler la course',
      'Êtes-vous sûr de vouloir annuler cette course ?',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui, annuler', 
          style: 'destructive',
          onPress: () => {
            showToast('success', 'Course annulée');
            router.back();
          }
        }
      ]
    );
  };

  const handleCallTransporter = () => {
    Alert.alert(
      'Appeler le transporteur',
      `Voulez-vous appeler ${params.transporterName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Appeler', onPress: () => showToast('info', 'Appel en cours...') }
      ]
    );
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    showToast('success', 'Paiement effectué avec succès !');
    setTimeout(() => {
      router.replace('/(client)');
    }, 2000);
  };

  const getStatusText = () => {
    switch (rideStatus) {
      case 'searching': return 'Recherche d\'un transporteur...';
      case 'accepted': return 'Transporteur trouvé ! En route vers vous';
      case 'pickup': return 'Transporteur arrivé au point de départ';
      case 'inProgress': return 'Course en cours...';
      case 'completed': return 'Course terminée';
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (rideStatus) {
      case 'searching': return 'text-yellow-600';
      case 'accepted': return 'text-blue-600';
      case 'pickup': return 'text-green-600';
      case 'inProgress': return 'text-purple-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          Suivi de course
        </Text>
        <Text className="text-white/90 font-montserrat mt-2">
          Course #{params.transporterId?.slice(-6)}
        </Text>
      </View>

      {/* Map Area */}
      <View className="flex-1 relative">
        {currentLocation ? (
          <MapComponent
            transporters={[]}
            onSelectTransporter={() => {}}
            pickup={params.pickup!}
            destination={params.destination!}
            showRoute={rideStatus === 'inProgress' || rideStatus === 'completed'}
            currentLocation={currentLocation.coords}
            transporterLocation={transporterLocation}
          />
        ) : (
          <View 
            style={{ width, height: height - 400 }}
            className="bg-gray-200 items-center justify-center"
          >
            <View className="bg-white rounded-xl p-6 mx-4">
              <View className="flex-row items-center mb-4">
                <MapPin size={24} color="#f59e0b" />
                <Text className="text-gray-800 font-montserrat-bold text-lg ml-2">
                  Suivi en temps réel
                </Text>
              </View>
              
              <Text className="text-gray-600 font-montserrat mb-2">
                📍 Départ: {params.pickup}
              </Text>
              <Text className="text-gray-600 font-montserrat mb-4">
                🎯 Destination: {params.destination}
              </Text>
              
              <Text className={`font-montserrat-medium ${getStatusColor()}`}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Panel */}
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg">
          {/* Status */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className={`font-montserrat-bold text-lg ${getStatusColor()}`}>
                {getStatusText()}
              </Text>
              {canCancel && timeLeft > 0 && (
                <Text className="text-gray-500 font-montserrat text-sm">
                  Annulation possible pendant {formatTime(timeLeft)}
                </Text>
              )}
            </View>
            <Text className="text-green-600 font-montserrat-bold text-xl">
              ${params.price}
            </Text>
          </View>

          {/* Transporter Info */}
          {rideStatus !== 'searching' && (
            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center">
                <AvatarPlaceholder 
                  name={params.transporterName || 'Transporteur'}
                  size={50}
                />
                <View className="flex-1 ml-4">
                  <Text className="text-gray-800 font-montserrat-bold text-lg">
                    {params.transporterName}
                  </Text>
                  <Text className="text-gray-600 font-montserrat">
                    Transporteur vérifié
                  </Text>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={handleCallTransporter}
                    className="w-10 h-10 bg-green-500 rounded-full items-center justify-center"
                  >
                    <Phone size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
                    <MessageCircle size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row space-x-3 gap-3">
            { canCancel && timeLeft > 0 && (
              <TouchableOpacity
                onPress={handleCancelRide}
                disabled={rideStatus == "completed"}
                className={`${rideStatus == "completed" ? 'bg-gray-600' :'bg-red-500'} p-3 rounded-lg flex-row items-center justify-center`}
              >
                <X size={20} color="white" />
                <Text className="text-white font-montserrat-medium ml-2">
                  Annuler
                </Text>
              </TouchableOpacity>
            )}
            
            {rideStatus === 'completed' && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setShowPayment(true)}
                  className="bg-green-500 p-3 rounded-lg flex-row items-center justify-center"
                >
                  <CreditCard size={20} color="white" />
                  <Text className="text-white font-montserrat-medium ml-2">
                    Payer ${params.price}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Payment Bottom Sheet */}
      <PaymentBottomSheet
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        rideId={params.transporterId!}
        amount={parseFloat(params.price!)}
        description={`Course ${params.transporterName}`}
        clientId="client-1"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </View>
  );
}