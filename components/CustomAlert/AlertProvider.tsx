import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlert, { 
  CustomAlertProps, 
  AlertType, 
  AlertButton 
} from './CustomAlert';

// Define the context interface
interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

// Define options for showing an alert
export interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  buttons?: AlertButton[];
  autoDismiss?: boolean;
  dismissTimeout?: number;
  icon?: string;
}

// Create the context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Custom hook for using the alert context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Alert Provider component
interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    options: Omit<CustomAlertProps, 'visible' | 'onBackdropPress'>;
  }>({
    visible: false,
    options: {
      title: '',
      message: '',
      type: 'info',
      buttons: [{ text: 'OK', style: 'primary' }],
    },
  });

  // Show alert with given options
  const showAlert = (options: AlertOptions) => {
    setAlertState({
      visible: true,
      options: {
        ...options,
      },
    });
  };

  // Hide the alert
  const hideAlert = () => {
    setAlertState((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // Convenience method for confirmation dialogs
  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Ja',
    cancelText: string = 'Abbrechen'
  ) => {
    showAlert({
      title,
      message,
      type: 'confirmation',
      buttons: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel || hideAlert,
        },
        {
          text: confirmText,
          style: 'primary',
          onPress: onConfirm,
        },
      ],
    });
  };

  const value = {
    showAlert,
    hideAlert,
    showConfirmation,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <CustomAlert
        visible={alertState.visible}
        onBackdropPress={hideAlert}
        {...alertState.options}
      />
    </AlertContext.Provider>
  );
};

export default AlertProvider;