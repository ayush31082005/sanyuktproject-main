import React, { useEffect, useRef } from 'react';

const RazorpayPaymentButton = ({ buttonId }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear container to prevent duplicate buttons on re-render
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
        script.setAttribute('data-payment_button_id', buttonId);
        script.async = true;

        const form = document.createElement('form');
        form.appendChild(script);

        containerRef.current.appendChild(form);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [buttonId]);

    return <div ref={containerRef} className="razorpay-button-container" />;
};

export default RazorpayPaymentButton;
