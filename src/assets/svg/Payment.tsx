import React from "react";

interface PaymentProps {
  fill?: string;
}

const Payment: React.FC<PaymentProps> = ({ fill = "#3b82f6" }) => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="19" height="14" rx="2" fill={fill} opacity="0.9"/>
      <rect x="6" y="10" width="13" height="2" rx="1" fill="white"/>
      <rect x="6" y="15" width="6" height="1.5" rx="0.75" fill="white" opacity="0.8"/>
      <rect x="14" y="15" width="5" height="1.5" rx="0.75" fill="white" opacity="0.8"/>
      <circle cx="20" cy="18" r="1.5" fill="white" opacity="0.8"/>
    </svg>
  );
};

export default Payment;