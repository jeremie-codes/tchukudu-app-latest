// types.ts

/**
 * Interface de base pour un utilisateur
 */
export interface BaseUser {
  id: string;
  phone: string;
  fullname?: string;
  email?: string;
  avatar?: string; // URL ou identifiant d'avatar
  isProfileComplete?: boolean;
  createdAt?: string; // Format ISO 8601
  updatedAt?: string; // Format ISO 8601
}

/**
 * Interface pour un utilisateur de type 'client'
 */
export interface ClientUser extends BaseUser {
  type: 'client';
}

/**
 * Interface pour un utilisateur de type 'transporter'
 * Inclut les informations essentielles pour la vérification et la gestion
 */
export interface TransporterUser extends BaseUser {
  type: 'transporter';
  vehicleId?: string; // ID du véhicule associé au transporteur
  hasActiveSubscription?: boolean; // Indique si le transporteur a un abonnement actif
  isVerified?: boolean; // Statut de vérification du transporteur par l'administration
  isOnline?: boolean; // Statut en ligne/hors ligne du transporteur

  // Informations sur le permis de conduire
  driverLicenseNumber?: string;
  driverLicenseCategory?: string; // Catégorie du permis (A, B, C, D, etc.)
  driverLicenseIssueDate?: string; // Format ISO 8601 (YYYY-MM-DD)
  driverLicenseExpiry?: string; // Format ISO 8601 (YYYY-MM-DD)
  driverLicenseImage?: string; // URL de l'image du permis de conduire

  // Informations professionnelles
  yearsOfExperience?: number;
  languagesSpoken?: string[]; // Langues parlées
  workingHours?: {
    start: string; // Format HH:MM
    end: string; // Format HH:MM
  };

  // Statistiques et évaluations
  totalRides?: number;
  averageRating?: number;
  totalEarnings?: number;
  completionRate?: number; // Pourcentage de courses terminées avec succès

  // Dates importantes
  lastActiveAt?: string; // Dernière activité en ligne
  verifiedAt?: string; // Date de vérification du compte
  suspendedAt?: string; // Date de suspension (si applicable)
  suspensionReason?: string; // Raison de la suspension
}

/**
 * Type union pour tous les types d'utilisateurs
 */
export type User = ClientUser | TransporterUser;

/**
 * Interface pour un véhicule avec informations détaillées
 */
export interface Vehicle {
  id: string;
  type: 'truck' | 'motorcycle' | 'van' | 'car';
  model: string;
  brand: string; // Marque du véhicule
  year?: number; // Année de fabrication
  color?: string; // Couleur du véhicule
  licensePlate: string;
  capacity: number; // Capacité en kg ou nombre de passagers
  pricePerKm: number;
  pricePerKg?: number; // Optionnel, pour le transport de marchandises
  image?: string; // URL de l'image du véhicule
  transporterId: string; // ID du transporteur propriétaire du véhicule

  // Informations techniques du véhicule
  engineNumber?: string;
  chassisNumber?: string;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  mileage?: number; // Kilométrage actuel

  // Documents du véhicule
  registrationNumber?: string;
  registrationExpiry?: string; // Format ISO 8601 (YYYY-MM-DD)
  registrationImage?: string; // URL de l'image de la carte grise

  // Statut et maintenance
  isActive?: boolean; // Véhicule actif ou non
  lastMaintenanceDate?: string; // Format ISO 8601 (YYYY-MM-DD)
  nextMaintenanceDate?: string; // Format ISO 8601 (YYYY-MM-DD)
  
  createdAt?: string; // Format ISO 8601
  updatedAt?: string; // Format ISO 8601
}

/**
 * Interface pour une méthode de paiement
 */
export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card';
  name: string;
  icon: string; // Représentation textuelle de l'icône (ex: '📱')
  description: string;
  isActive?: boolean;
}

/**
 * Interface pour un plan d'abonnement
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // Durée en jours
  features: string[]; // Liste des fonctionnalités incluses
  popular?: boolean; // Indique si le plan est populaire
  isActive?: boolean;
  createdAt?: string; // Format ISO 8601
  updatedAt?: string; // Format ISO 8601
}

/**
 * Interface pour un abonnement actif
 */
export interface Subscription {
  id: string;
  transporterId: string;
  planId: string;
  startDate: string; // Format ISO 8601
  endDate: string; // Format ISO 8601
  isActive: boolean;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string; // Format ISO 8601
  updatedAt: string; // Format ISO 8601
}

/**
 * Interface de base pour une course
 */
export interface BaseRide {
  id: string;
  pickup: string; // Adresse de départ
  destination: string; // Adresse de destination
  estimatedPrice: number;
  distance: string; // Ex: "12 km"
  time: string; // Ex: "25 min"
  vehicleType: string; // Ex: "Moto", "Camion"
  serviceType: string; // Ex: "Express", "Standard"
  transportType: string; // Ex: "goods", "people"
}

/**
 * Interface pour une course disponible ou historique
 */
export interface Ride extends BaseRide {
  clientId: string; // ID du client qui a réservé la course
  transporterId?: string; // ID du transporteur qui a effectué la course (si acceptée/terminée)
  clientName: string; // Nom du client (pour affichage)
  transporterName?: string; // Nom du transporteur (pour affichage)
  status: 'available' | 'accepted' | 'pickup' | 'inProgress' | 'completed' | 'cancelled';
  date?: string; // Date de la course (pour l'historique)
  rating?: number; // Note donnée par le client
  comment?: string; // Commentaire du client
  ratedAt?: string; // Date de l'évaluation
  
  // Coordonnées GPS
  pickupCoordinates?: { latitude: number; longitude: number };
  destinationCoordinates?: { latitude: number; longitude: number };
  
  // Informations de paiement
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  
  createdAt?: string; // Format ISO 8601
  updatedAt?: string; // Format ISO 8601
}

/**
 * Interface pour une course active (suivie par le transporteur ou le client)
 */
export interface ActiveRide extends BaseRide {
  clientId: string;
  transporterId: string;
  clientName: string;
  transporterName: string;
  status: 'accepted' | 'pickup' | 'inProgress' | 'completed';
  acceptedAt: Date; // Date et heure d'acceptation de la course
  
  // Coordonnées GPS pour le suivi en temps réel
  pickupCoordinates?: { latitude: number; longitude: number };
  destinationCoordinates?: { latitude: number; longitude: number };
  currentLocation?: { latitude: number; longitude: number };
}

/**
 * Interface pour les résultats de recherche de transporteurs (vue simplifiée pour le client)
 */
export interface TransporterSearchResult {
  id: string;
  name: string;
  rating: number;
  distance: string;
  vehicle: string; // Type de véhicule en string (ex: "Toyota Hilux")
  price: number; // Prix estimé pour la course
  location: { latitude: number; longitude: number }; // Position actuelle du transporteur
  phone: string;
  reviews: number;
  vehicleImage?: string; // URL de l'image du véhicule
  isVerified?: boolean;
  responseTime?: string; // Temps de réponse moyen
}

/**
 * Interface pour les évaluations/ratings
 */
export interface Rating {
  id: string;
  rideId: string;
  clientId: string;
  transporterId: string;
  overallRating: number; // Note globale (1-5)
  punctuality: number; // Ponctualité (1-5)
  safety: number; // Sécurité (1-5)
  vehicleCondition: number; // État du véhicule (1-5)
  serviceQuality: number; // Qualité du service (1-5)
  comment?: string;
  createdAt: string; // Format ISO 8601
}

/**
 * Interface pour les transactions de paiement
 */
export interface PaymentTransaction {
  id: string;
  type: 'subscription' | 'ride';
  userId: string; // ID du payeur
  amount: number;
  currency: string; // Ex: 'USD', 'CDF'
  paymentMethodId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionReference?: string; // Référence externe (Stripe, mobile money, etc.)
  rideId?: string; // Si c'est un paiement de course
  subscriptionId?: string; // Si c'est un paiement d'abonnement
  createdAt: string; // Format ISO 8601
  updatedAt: string; // Format ISO 8601
}

/**
 * Interface pour les notifications
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'ride_request' | 'ride_accepted' | 'ride_completed' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any; // Données supplémentaires spécifiques au type de notification
  createdAt: string; // Format ISO 8601
}

/**
 * Interface pour les paramètres de l'application
 */
export interface AppSettings {
  id: string;
  userId: string;
  notifications: {
    rideRequests: boolean;
    promotions: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareProfile: boolean;
  };
  language: string; // Code de langue (ex: 'fr', 'en')
  currency: string; // Devise préférée
  createdAt: string; // Format ISO 8601
  updatedAt: string; // Format ISO 8601
}