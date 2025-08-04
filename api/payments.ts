// TO REPLACE WITH REAL ENDPOINT
const API_BASE = 'https://your-laravel-backend.com/api';

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card';
  name: string;
  icon: string;
  description: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  popular?: boolean;
}

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const methods: PaymentMethod[] = [
        {
          id: 'airtel_money',
          type: 'mobile_money',
          name: 'Airtel Money',
          icon: '📱',
          description: 'Paiement via Airtel Money'
        },
        {
          id: 'orange_money',
          type: 'mobile_money',
          name: 'Orange Money',
          icon: '🟠',
          description: 'Paiement via Orange Money'
        },
        {
          id: 'mpesa',
          type: 'mobile_money',
          name: 'M-Pesa',
          icon: '💚',
          description: 'Paiement via M-Pesa'
        },
        {
          id: 'visa_card',
          type: 'card',
          name: 'Carte Visa',
          icon: '💳',
          description: 'Paiement par carte bancaire'
        },
        {
          id: 'mastercard',
          type: 'card',
          name: 'Mastercard',
          icon: '💳',
          description: 'Paiement par carte bancaire'
        }
      ];
      resolve(methods);
    }, 500);
  });
  
  // PRODUCTION CODE:
  // return axios.get(`${API_BASE}/payments/methods`)
  //   .then(response => response.data);
};

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const plans: SubscriptionPlan[] = [
        {
          id: 'weekly',
          name: 'Hebdomadaire',
          price: 5,
          duration: 7,
          features: [
            'Accès aux courses',
            'Support client',
            'Notifications en temps réel'
          ]
        },
        {
          id: 'monthly',
          name: 'Mensuel',
          price: 20,
          duration: 30,
          features: [
            'Accès aux courses',
            'Support client prioritaire',
            'Notifications en temps réel',
            'Statistiques avancées'
          ],
          popular: true
        },
        {
          id: 'quarterly',
          name: 'Trimestriel',
          price: 50,
          duration: 90,
          features: [
            'Accès aux courses',
            'Support client VIP',
            'Notifications en temps réel',
            'Statistiques avancées',
            'Réduction de 17%'
          ]
        }
      ];
      resolve(plans);
    }, 500);
  });
  
  // PRODUCTION CODE:
  // return axios.get(`${API_BASE}/subscriptions/plans`)
  //   .then(response => response.data);
};

export const initiateMobilePayment = async (data: {
  planId: string;
  paymentMethodId: string;
  phoneNumber: string;
  transporterId: string;
}) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: 'txn_' + Date.now(),
        message: 'Paiement initié. Vérifiez votre téléphone pour confirmer.',
        status: 'pending'
      });
    }, 1500);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/payments/mobile-money`, data)
  //   .then(response => response.data);
};

export const initiateCardPayment = async (data: {
  planId: string;
  paymentMethodId: string;
  transporterId: string;
}) => {
  // Mock API call - Returns payment URL for WebView
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentUrl: 'https://sandbox-payment.example.com/pay?token=mock_token_' + Date.now(),
        transactionId: 'txn_' + Date.now(),
        message: 'Redirection vers la page de paiement sécurisée'
      });
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/payments/card`, data)
  //   .then(response => response.data);
};

export const verifyPayment = async (transactionId: string) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        status: 'completed',
        subscription: {
          id: 'sub_' + Date.now(),
          planId: 'monthly',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      });
    }, 2000);
  });
  
  // PRODUCTION CODE:
  // return axios.get(`${API_BASE}/payments/verify/${transactionId}`)
  //   .then(response => response.data);
};

export const initiateRidePayment = async (data: {
  rideId: string;
  amount: number;
  paymentMethodId: string;
  phoneNumber?: string;
  clientId: string;
}) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.paymentMethodId.includes('mobile')) {
        resolve({
          success: true,
          transactionId: 'ride_txn_' + Date.now(),
          message: 'Paiement initié. Vérifiez votre téléphone pour confirmer.',
          status: 'pending'
        });
      } else {
        resolve({
          success: true,
          paymentUrl: 'https://sandbox-payment.example.com/ride-pay?token=ride_token_' + Date.now(),
          transactionId: 'ride_txn_' + Date.now(),
          message: 'Redirection vers la page de paiement sécurisée'
        });
      }
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/payments/ride`, data)
  //   .then(response => response.data);
};