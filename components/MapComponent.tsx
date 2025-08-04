import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MapPin, Navigation, Phone } from 'lucide-react-native';

interface Transporter {
  id: string;
  name: string;
  rating: number;
  distance: string;
  vehicle: string;
  price: number;
  location: { latitude: number; longitude: number };
  phone: string;
  reviews: number;
}

interface MapComponentProps {
  transporters: Transporter[];
  onSelectTransporter: (transporter: Transporter) => void;
  pickup: string;
  destination: string;
  showRoute?: boolean;
  currentLocation?: { latitude: number; longitude: number } | null;
  transporterLocation?: { latitude: number; longitude: number } | null;
  isTransporterView?: boolean;
  onCompleteRide?: () => void;
}

export default function MapComponent({ 
  transporters, 
  onSelectTransporter, 
  pickup, 
  destination,
  showRoute = false,
  currentLocation,
  transporterLocation,
  isTransporterView = false,
  onCompleteRide
}: MapComponentProps) {
  const [region, setRegion] = useState({
    latitude: currentLocation?.latitude || -4.3276,
    longitude: currentLocation?.longitude || 15.3136,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    if (showRoute && currentLocation) {
      // Generate route coordinates (in production, use Google Directions API)
      const destinationCoords = transporterLocation || { 
        latitude: currentLocation.latitude + 0.02, 
        longitude: currentLocation.longitude + 0.015 
      };
      
      const mockRoute = [
        currentLocation,
        { latitude: currentLocation.latitude + 0.005, longitude: currentLocation.longitude + 0.005 },
        { latitude: currentLocation.latitude + 0.01, longitude: currentLocation.longitude + 0.01 },
        { latitude: currentLocation.latitude + 0.015, longitude: currentLocation.longitude + 0.012 },
        destinationCoords,
      ];
      setRouteCoordinates(mockRoute);
    }
  }, [showRoute, currentLocation, transporterLocation]);

  return (
    <View className="flex-1 relative">
      <MapView
        style={{ width, height: height - 200 }}
        initialRegion={region}
        onRegionChange={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsTraffic={true}
        mapType="standard"
      >
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Ma position"
            pinColor="blue"
          />
        )}

        {/* Transporter Location Marker (for client tracking) */}
        {transporterLocation && !isTransporterView && (
          <Marker
            coordinate={transporterLocation}
            title="Transporteur"
            pinColor="red"
          />
        )}

        {/* Transporter Markers (for selection) */}
        {transporters.map((transporter) => (
          <Marker
            key={transporter.id}
            coordinate={transporter.location}
            title={transporter.name}
            description={`${transporter.vehicle} - $${transporter.price}`}
            onPress={() => onSelectTransporter(transporter)}
          >
            <View className="bg-yellow-500 p-2 rounded-full">
              <Text className="text-white font-montserrat-bold text-xs">
                ${transporter.price}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Route Polyline */}
        {showRoute && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#f59e0b"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Route Info Overlay */}
      {showRoute && (
        <View className="absolute top-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-800 font-montserrat-bold text-lg">
              Course active
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Navigation size={20} color="#f59e0b" />
            <Text className="text-gray-800 font-montserrat-bold ml-2">
              Itinéraire optimisé
            </Text>
          </View>
          <Text className="text-gray-600 font-montserrat text-sm">
            📍 Départ: {pickup}
          </Text>
          <Text className="text-gray-600 font-montserrat text-sm">
            🎯 Destination: {destination}
          </Text>
          <Text className="text-green-600 font-montserrat-medium text-sm mt-2">
            Distance: ~12 km • Temps estimé: 25 min
          </Text>
        </View>
      )}

      {/* Complete Ride Button (for transporter) */}
      {isTransporterView && showRoute && onCompleteRide && (
        <View className="absolute bottom-4 left-4 right-4">
          <TouchableOpacity
            onPress={onCompleteRide}
            className="bg-green-500 py-4 px-6 rounded-xl"
          >
            <Text className="text-white font-montserrat-bold text-center text-lg">
              Marquer comme terminé
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transporters List Overlay (only if not showing route) */}
      {!showRoute && transporters.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 max-h-60">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
          
          <Text className="text-gray-800 font-montserrat-bold text-lg mb-4">
            Transporteurs à proximité ({transporters.length})
          </Text>
          
          <View className="space-y-3">
            {transporters.slice(0, 2).map((transporter) => (
              <TouchableOpacity
                key={transporter.id}
                onPress={() => onSelectTransporter(transporter)}
                className="flex-row items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <View className="flex-1">
                  <Text className="text-gray-800 font-montserrat-bold">
                    {transporter.name}
                  </Text>
                  <Text className="text-gray-600 font-montserrat text-sm">
                    {transporter.vehicle} • {transporter.distance}
                  </Text>
                </View>
                <Text className="text-green-600 font-montserrat-bold">
                  ${transporter.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}