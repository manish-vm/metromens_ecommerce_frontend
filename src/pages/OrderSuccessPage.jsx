import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderByOrderId } from '../services/orderService';
import '../css/orderSuccess.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderByOrderId(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-success-page">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <img src="https://assets-v2.lottiefiles.com/a/6192c96c-1184-11ee-94d6-87985660cc3b/eKofKHrW1u.gif" alt="Order Success" className="success-image" />
      <h1>Order Placed</h1>
      <p>Your order ID is {orderId}</p>
      <div className="success-actions">
       
        <Link to="/account" state={{ activeTab: 'orders' }} className="btn-view-orders">
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
