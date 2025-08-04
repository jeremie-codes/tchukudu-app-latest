import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { X, CreditCard, Smartphone, Check, Loader } from 'lucide-react-native';
import { 
  PaymentMethod, 
  SubscriptionPlan, 
  getPaymentMethods, 
  initiateMobilePayment, 
  initiateCardPayment,
  initiateRidePayment,
  verifyPayment 
} from '@/api/payments';
import { showToast } from '@/utils/toast';

interface PaymentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedPlan?: SubscriptionPlan | null;
  transporterId?: string;
  rideId?: string;
  amount?: number;
  description?: string;
  clientId?: string;
  onPaymentSuccess: () => void;
}

export default function PaymentBottomSheet({ 
  visible, 
  onClose, 
  selectedPlan, 
  transporterId,
  rideId,
  amount,
  description,
  clientId,
  onPaymentSuccess 
}: PaymentBottomSheetProps) {
  const [step, setStep] = useState<'methods' | 'mobile_form' | 'card_payment' | 'processing'>('methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const { height } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      loadPaymentMethods();
      setStep('methods');
      setSelectedMethod(null);
      setPhoneNumber('');
      setPaymentUrl('');
      setTransactionId('');
    }
  }, [visible]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      showToast('error', 'Erreur lors du chargement des méthodes de paiement');
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method.type === 'mobile_money') {
      setStep('mobile_form');
    } else {
      handleCardPayment(method);
    }
  };

  const handleMobilePayment = async () => {
    if (!selectedMethod || !phoneNumber.trim()) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }

    if (!selectedPlan && !rideId) {
      showToast('error', 'Données de paiement manquantes');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      let result;
      
      if (selectedPlan && transporterId) {
        // Subscription payment
        result = await initiateMobilePayment({
          planId: selectedPlan.id,
          paymentMethodId: selectedMethod.id,
          phoneNumber: phoneNumber.trim(),
          transporterId
        });
      } else if (rideId && amount && clientId) {
        // Ride payment
        result = await initiateRidePayment({
          rideId,
          amount,
          paymentMethodId: selectedMethod.id,
          phoneNumber: phoneNumber.trim(),
          clientId
        });
      }

      if (result && result.success) {
        setTransactionId(result.transactionId);
        showToast('success', result.message);
        
        // Simulate payment verification after 5 seconds
        setTimeout(async () => {
          try {
            const verification = await verifyPayment(result.transactionId);
            if (verification.success && verification.status === 'completed') {
              showToast('success', 'Paiement confirmé !');
              onPaymentSuccess();
              onClose();
            } else {
              showToast('error', 'Paiement non confirmé');
              setStep('methods');
            }
          } catch (error) {
            showToast('error', 'Erreur lors de la vérification');
            setStep('methods');
          }
          setLoading(false);
        }, 5000);
      } else {
        showToast('error', 'Erreur lors du paiement');
        setStep('methods');
        setLoading(false);
      }
    } catch (error) {
      showToast('error', 'Erreur lors du paiement');
      setStep('methods');
      setLoading(false);
    }
  };

  const handleCardPayment = async (method: PaymentMethod) => {
    if (!selectedPlan && !rideId) return;

    setLoading(true);
    setStep('processing');

    try {
      let result;
      
      if (selectedPlan && transporterId) {
        // Subscription payment
        result = await initiateCardPayment({
          planId: selectedPlan.id,
          paymentMethodId: method.id,
          transporterId
        });
      } else if (rideId && amount && clientId) {
        // Ride payment
        result = await initiateRidePayment({
          rideId,
          amount,
          paymentMethodId: method.id,
          clientId
        });
      }

      if (result && result.success && result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
        setTransactionId(result.transactionId);
        setStep('card_payment');
      } else {
        showToast('error', 'Erreur lors de l\'initialisation du paiement');
        setStep('methods');
      }
    } catch (error) {
      showToast('error', 'Erreur lors du paiement');
      setStep('methods');
    }
    setLoading(false);
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    // Check if payment is completed based on URL
    if (navState.url.includes('success') || navState.url.includes('completed')) {
      setStep('processing');
      setLoading(true);
      
      // Verify payment
      setTimeout(async () => {
        try {
          const verification = await verifyPayment(transactionId);
          if (verification.success && verification.status === 'completed') {
            showToast('success', 'Paiement confirmé !');
            onPaymentSuccess();
            onClose();
          } else {
            showToast('error', 'Paiement non confirmé');
            setStep('methods');
          }
        } catch (error) {
          showToast('error', 'Erreur lors de la vérification');
          setStep('methods');
        }
        setLoading(false);
      }, 2000);
    } else if (navState.url.includes('cancel') || navState.url.includes('error')) {
      showToast('error', 'Paiement annulé');
      setStep('methods');
    }
  };

  const renderMethodsStep = () => (
    <ScrollView className="flex-1">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-gray-800 font-montserrat-bold text-xl">
            Choisir un mode de paiement
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {selectedPlan && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <Text className="text-yellow-800 font-montserrat-bold text-lg">
              {selectedPlan.name}
            </Text>
            <Text className="text-yellow-700 font-montserrat text-2xl">
              ${selectedPlan.price}
            </Text>
            <Text className="text-yellow-600 font-montserrat text-sm">
              {selectedPlan.duration} jours d'accès complet
            </Text>
          </View>
        )}

        {!selectedPlan && amount && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <Text className="text-blue-800 font-montserrat-bold text-lg">
              {description || 'Paiement de course'}
            </Text>
            <Text className="text-blue-700 font-montserrat text-2xl">
              ${amount}
            </Text>
            <Text className="text-blue-600 font-montserrat text-sm">
              Paiement sécurisé pour votre course
            </Text>
          </View>
        )}

        <Text className="text-gray-700 font-montserrat-bold mb-4">
          Mobile Money
        </Text>
        <View className="space-y-3 mb-6">
          {paymentMethods.filter(m => m.type === 'mobile_money').map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handleMethodSelect(method)}
              className="bg-white border border-gray-200 rounded-xl p-4 flex-row items-center"
            >
              <Text className="text-2xl mr-4">{method.icon}</Text>
              <View className="flex-1">
                <Text className="text-gray-800 font-montserrat-bold">
                  {method.name}
                </Text>
                <Text className="text-gray-600 font-montserrat text-sm">
                  {method.description}
                </Text>
              </View>
              <Text className="text-gray-400 text-xl">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-700 font-montserrat-bold mb-4">
          Carte bancaire
        </Text>
        <View className="space-y-3">
          {paymentMethods.filter(m => m.type === 'card').map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handleMethodSelect(method)}
              className="bg-white border border-gray-200 rounded-xl p-4 flex-row items-center"
            >
              <Text className="text-2xl mr-4">{method.icon}</Text>
              <View className="flex-1">
                <Text className="text-gray-800 font-montserrat-bold">
                  {method.name}
                </Text>
                <Text className="text-gray-600 font-montserrat text-sm">
                  {method.description}
                </Text>
              </View>
              <Text className="text-gray-400 text-xl">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderMobileFormStep = () => (
    <View className="flex-1 p-6">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => setStep('methods')}>
          <Text className="text-yellow-500 font-montserrat-medium">‹ Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {selectedMethod && (
        <View className="items-center mb-8">
          <Text className="text-4xl mb-2">{selectedMethod.icon}</Text>
          <Text className="text-gray-800 font-montserrat-bold text-xl">
            {selectedMethod.name}
          </Text>
          <Text className="text-gray-600 font-montserrat">
            Paiement de ${selectedPlan?.price}
          </Text>
        </View>
      )}

      <View className="mb-6">
        <View className="flex-row items-center mb-2">
          <Smartphone size={16} color="#f59e0b" />
          <Text className="text-gray-700 font-montserrat-medium ml-2">
            Numéro de téléphone
          </Text>
        </View>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+243 XXX XXX XXX"
          keyboardType="phone-pad"
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 font-montserrat"
        />
      </View>

      <TouchableOpacity
        onPress={handleMobilePayment}
        disabled={loading || !phoneNumber.trim()}
        className={`py-4 px-6 rounded-xl ${
          loading || !phoneNumber.trim() ? 'bg-gray-300' : 'bg-yellow-500'
        }`}
      >
        <Text className="text-white text-lg font-montserrat-medium text-center">
          {loading ? 'Traitement...' : `Payer $${selectedPlan?.price || amount}`}
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-500 text-sm font-montserrat text-center mt-4">
        Vous recevrez une notification sur votre téléphone pour confirmer le paiement
      </Text>
    </View>
  );

  const renderCardPaymentStep = () => (
    <View className="flex-1">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => setStep('methods')}>
          <Text className="text-yellow-500 font-montserrat-medium">‹ Retour</Text>
        </TouchableOpacity>
        <Text className="text-gray-800 font-montserrat-bold">
          Paiement sécurisé
        </Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={{ flex: 1 }}
      />
    </View>
  );

  const renderProcessingStep = () => (
    <View className="flex-1 items-center justify-center p-6">
      <View className="flex-row items-center justify-between mb-6 w-full">
        <View />
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <View className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mb-4">
          <Loader size={32} color="#f59e0b" className="animate-spin" />
        </View>
        <Text className="text-gray-800 font-montserrat-bold text-xl mb-2">
          Traitement en cours
        </Text>
        <Text className="text-gray-600 font-montserrat text-center">
          {selectedMethod?.type === 'mobile_money' 
            ? 'Vérifiez votre téléphone pour confirmer le paiement'
            : 'Vérification du paiement en cours...'
          }
        </Text>
        
        {transactionId && (
          <Text className="text-gray-500 font-montserrat text-sm mt-4">
            Transaction: {transactionId}
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'methods': return renderMethodsStep();
      case 'mobile_form': return renderMobileFormStep();
      case 'card_payment': return renderCardPaymentStep();
      case 'processing': return renderProcessingStep();
      default: return renderMethodsStep();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50" style={{ maxHeight: height * 0.9 }}>
        {renderStep()}
      </View>
    </Modal>
  );
}