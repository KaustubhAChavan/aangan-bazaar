export {};

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      modal?: {
        ondismiss?: () => void;
      };
      retry?: {
        enabled?: boolean;
      };
      theme?: {
        color?: string;
      };
    }) => {
      on: (
        event: "payment.failed",
        handler: (response: {
          error?: {
            code?: string;
            description?: string;
            metadata?: {
              order_id?: string;
              payment_id?: string;
            };
            reason?: string;
            source?: string;
            step?: string;
          };
        }) => void,
      ) => void;
      open: () => void;
    };
  }
}
