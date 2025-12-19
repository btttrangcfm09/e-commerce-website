import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderSummary = ({ summary, onCheckout }) => {
    const { originalPrice, savings, shippingCost, total } = summary;

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xl font-semibold text-gray-900">Order summary</p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">Original price</dt>
                        <dd className="text-base font-medium text-gray-900">${originalPrice?.toFixed(2)}</dd>
                    </dl>

                    {savings > 0 && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-500">Savings</dt>
                            <dd className="text-base font-medium text-green-600">-${savings?.toFixed(2)}</dd>
                        </dl>
                    )}

                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-500">Store Pickup</dt>
                        <dd className="text-base font-medium text-gray-900">${shippingCost?.toFixed(2)}</dd>
                    </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-gray-900">${total?.toFixed(2)}</dd>
                </dl>
            </div>

            <button
                onClick={onCheckout}
                className="flex w-full items-center justify-center rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-300"
            >
                Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500">or</span>
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 underline hover:no-underline"
                >
                    Continue Shopping
                    <FaLongArrowAltRight className="h-5 w-5 stroke-0" />
                </Link>
            </div>
        </div>
    );
};

export default OrderSummary;
