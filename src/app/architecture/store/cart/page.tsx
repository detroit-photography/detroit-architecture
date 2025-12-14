'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Lock, Tag, Gift } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const SIZE_LABELS = {
  '11x17': '11×17" Framed',
  '13x19': '13×19" Framed',
}

// Bulk discount tiers
const BULK_DISCOUNTS = [
  { qty: 5, percent: 25, label: '5+ prints' },
  { qty: 4, percent: 20, label: '4 prints' },
  { qty: 3, percent: 15, label: '3 prints' },
  { qty: 2, percent: 10, label: '2 prints' },
]

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

  // Calculate discount
  const { discountPercent, discountAmount, finalPrice, nextTier } = useMemo(() => {
    const tier = BULK_DISCOUNTS.find(d => totalItems >= d.qty)
    const percent = tier?.percent || 0
    const amount = Math.round(totalPrice * percent / 100)
    const final = totalPrice - amount
    
    // Find next tier for upsell
    const nextTierIndex = BULK_DISCOUNTS.findIndex(d => totalItems >= d.qty)
    const next = nextTierIndex > 0 ? BULK_DISCOUNTS[nextTierIndex - 1] : 
                 nextTierIndex === -1 ? BULK_DISCOUNTS[BULK_DISCOUNTS.length - 1] : null
    
    return { discountPercent: percent, discountAmount: amount, finalPrice: final, nextTier: next }
  }, [totalItems, totalPrice])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
        <h1 className="font-display text-2xl text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some beautiful Detroit prints to get started.</p>
        <Link
          href="/architecture/store"
          className="bg-detroit-green text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Browse Prints
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-detroit-green text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/architecture/store"
            className="inline-flex items-center gap-2 text-detroit-gold hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="font-display text-3xl">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.photoUrl}
                    alt={item.buildingName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {item.buildingName}
                  </h3>
                  {item.caption && (
                    <p className="text-sm text-gray-500 line-clamp-1">{item.caption}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">
                    {SIZE_LABELS[item.size]}
                  </p>

                  {/* Quantity & Price */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-detroit-green">
                        ${item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display text-xl mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} prints)</span>
                  <span>${totalPrice}</span>
                </div>
                
                {/* Discount */}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Bulk Discount ({discountPercent}% off)
                    </span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t my-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-detroit-green">${finalPrice}</span>
                </div>
                {discountPercent > 0 && (
                  <p className="text-xs text-green-600 mt-1">You're saving ${discountAmount}!</p>
                )}
              </div>

              {/* Upsell for next discount tier */}
              {nextTier && totalItems < 5 && (
                <div className="bg-detroit-gold/10 border border-detroit-gold/30 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Gift className="w-4 h-4 text-detroit-gold mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        Add {nextTier.qty - totalItems} more print{nextTier.qty - totalItems > 1 ? 's' : ''} for {nextTier.percent}% off!
                      </p>
                      <Link href="/architecture/store" className="text-detroit-green hover:underline text-xs">
                        Browse more prints →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <Link
                href="/architecture/store/checkout"
                className="block w-full bg-detroit-gold text-detroit-green text-center py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                Secure checkout with PayPal
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-4 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
            
            {/* Discount Tiers Info */}
            <div className="bg-gray-100 rounded-xl p-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Buy More, Save More
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                {BULK_DISCOUNTS.slice().reverse().map(tier => (
                  <div 
                    key={tier.qty} 
                    className={`flex justify-between ${totalItems >= tier.qty ? 'text-green-600 font-medium' : ''}`}
                  >
                    <span>{tier.label}</span>
                    <span>{tier.percent}% off</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
