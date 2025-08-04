// TO REPLACE WITH REAL ENDPOINT
const API_BASE = 'https://your-laravel-backend.com/api';

export const getAvailableTransporters = async (bookingParams: any) => {
  // Mock API call
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const mockTransporters = [
        {
          id: '1',
          name: 'Pierre Mukendi',
          rating: 4.8,
          distance: '0.5 km',
          vehicle: 'Toyota Hilux',
          price: 45,
          location: { latitude: -4.3276, longitude: 15.3136 },
          phone: '+243 812 345 678',
          reviews: 127
        },
        {
          id: '2',
          name: 'Marie Kabila',
          rating: 4.9,
          distance: '1.2 km',
          vehicle: 'Yamaha 125',
          price: 25,
          location: { latitude: -4.3280, longitude: 15.3140 },
          phone: '+243 899 876 543',
          reviews: 89
        },
        {
          id: '3',
          name: 'Joseph Tshisekedi',
          rating: 4.7,
          distance: '2.1 km',
          vehicle: 'Mitsubishi Canter',
          price: 67,
          location: { latitude: -4.3290, longitude: 15.3150 },
          phone: '+243 876 543 210',
          reviews: 156
        }
      ];
      resolve(mockTransporters);
    }, 1500);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/rides/search-transporters`, bookingParams)
  //   .then(response => response.data);
};

export const getAvailableRides = async () => {
  // Mock API call for transporters
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const mockRides = [
        {
          id: '1',
          pickup: 'Marché Central, Kinshasa',
          destination: 'Aéroport de N\'djili',
          client: 'Client Anonymous',
          vehicleType: 'truck',
          serviceType: 'express',
          transportType: 'goods',
          estimatedPrice: 75,
          distance: '25 km',
          time: '35 min'
        },
        {
          id: '2',
          pickup: 'Université de Kinshasa',
          destination: 'Gombe Centre',
          client: 'Étudiant Marie',
          vehicleType: 'motorcycle',
          serviceType: 'standard',
          transportType: 'people',
          estimatedPrice: 15,
          distance: '8 km',
          time: '15 min'
        }
      ];
      resolve(mockRides);
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.get(`${API_BASE}/rides/available`)
  //   .then(response => response.data);
};

export const getRideHistory = async () => {
  // Mock API call
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const mockHistory = [
        {
          id: '1',
          date: '15 Jan 2025',
          pickup: 'Marché Central',
          destination: 'Gombe',
          transporter: 'Pierre Mukendi',
          vehicle: 'Toyota Hilux',
          price: 35,
          status: 'completed',
          rating: 5,
          comment: 'Excellent service, très ponctuel !',
          ratedAt: '14 Jan 2025'
        },
        {
          id: '2',
          date: '14 Jan 2025',
          pickup: 'Université',
          destination: 'Aéroport',
          transporter: 'Marie Kabila',
          vehicle: 'Yamaha 125',
          price: 25,
          status: 'completed',
          canRate: true // Can still be rated
        }
      ];
      resolve(mockHistory);
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.get(`${API_BASE}/rides/history`)
  //   .then(response => response.data);
};

export const submitRating = async (rideId: string, rating: number, comment: string, criteria: any) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'Évaluation enregistrée avec succès' 
      });
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/rides/${rideId}/rating`, { rating, comment, criteria })
  //   .then(response => response.data);
};

export const bookRide = async (rideData: any) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        rideId: 'ride-' + Date.now(),
        message: 'Course réservée avec succès' 
      });
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/rides/book`, rideData)
  //   .then(response => response.data);
};