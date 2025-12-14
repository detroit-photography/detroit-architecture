'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, CheckCircle, Package, Tag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

declare global {
  interface Window {
    paypal?: any
  }
}

const SIZE_LABELS = {
  '11x17': '11×17" Framed',
  '13x19': '13×19" Framed',
}

// Bulk discount tiers
const BULK_DISCOUNTS = [
  { qty: 5, percent: 25 },
  { qty: 4, percent: 20 },
  { qty: 3, percent: 15 },
  { qty: 2, percent: 10 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const paypalRef = useRef<HTMLDivElement>(null)

  // Calculate discount
  const { discountPercent, discountAmount, finalPrice } = useMemo(() => {
    const tier = BULK_DISCOUNTS.find(d => totalItems >= d.qty)
    const percent = tier?.percent || 0
    const amount = Math.round(totalPrice * percent / 100)
    const final = totalPrice - amount
    return { discountPercent: percent, discountAmount: amount, finalPrice: final }
  }, [totalItems, totalPrice])

  // Load PayPal SDK
  useEffect(() => {
    if (items.length === 0) {
      setLoading(false)
      return
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setPaypalError('PayPal is not configured. Please contact support.')
      setLoading(false)
      return
    }

    // Check if already loaded
    if (window.paypal) {
      setPaypalLoaded(true)
      setLoading(false)
      return
    }

    const script = document.createElement('script')
    // Add enable-funding to show more payment options, and disable-funding to remove certain ones
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&enable-funding=venmo,card`
    script.async = true
    script.setAttribute('data-sdk-integration-source', 'button-factory')
    script.onload = () => {
      if (window.paypal) {
        setPaypalLoaded(true)
      } else {
        setPaypalError('PayPal loaded but not available. Please refresh the page.')
      }
      setLoading(false)
    }
    script.onerror = (e) => {
      console.error('Failed to load PayPal SDK:', e)
      setPaypalError('Failed to load PayPal. Please check your internet connection and try again.')
      setLoading(false)
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [items.length])

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalRef.current || items.length === 0) return

    // Clear previous buttons
    paypalRef.current.innerHTML = ''

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48,
        },
        createOrder: (data: any, actions: any) => {
          // Simplified order creation for better compatibility
          return actions.order.create({
            purchase_units: [{
              description: `Detroit Architecture Prints (${totalItems} items)`,
              amount: {
                currency_code: 'USD',
                value: finalPrice.toFixed(2),
              },
            }],
          })
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const order = await actions.order.capture()
            console.log('Order completed:', order)
            
            // Store order details for confirmation
            setOrderId(order.id)
            setOrderComplete(true)
            
            // Clear cart after successful payment
            clearCart()
          } catch (captureError) {
            console.error('Capture error:', captureError)
            setPaypalError('Payment capture failed. Please try again.')
          }
        },
        onCancel: () => {
          console.log('Payment cancelled by user')
        },
        onError: (err: any) => {
          console.error('PayPal error:', err)
          setPaypalError('Payment failed. Please try again or use a different payment method.')
        },
      }).render(paypalRef.current).catch((renderError: any) => {
        console.error('PayPal render error:', renderError)
        setPaypalError('Could not display payment options. Please refresh the page.')
      })
    } catch (e) {
      console.error('PayPal initialization error:', e)
      setPaypalError('Payment system error. Please try again later.')
    }
  }, [paypalLoaded, items, totalPrice, totalItems, finalPrice, clearCart])

  // Order complete view
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-display text-2xl text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your prints will be shipped within 5-7 business days.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-5 h-5 text-detroit-green" />
              <div>
                <p className="font-medium text-gray-900">What's next?</p>
                <p className="text-gray-600">
                  You'll receive a confirmation email with tracking info once your prints ship.
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/architecture/store"
            className="inline-block bg-detroit-green text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Empty cart
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="font-display text-2xl text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some prints to proceed to checkout.</p>
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
            href="/architecture/store/cart"
            className="inline-flex items-center gap-2 text-detroit-gold hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="font-display text-3xl">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="font-display text-xl mb-4">Order Summary</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.photoUrl}
                      alt={item.buildingName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {item.buildingName}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-gray-500 line-clamp-1">{item.caption}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {SIZE_LABELS[item.size]} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${item.price * item.quantity}
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal ({totalItems} prints)</span>
                  <span>${totalPrice}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Bulk Discount ({discountPercent}% off)
                    </span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-detroit-green">${finalPrice}</span>
                </div>
                {discountPercent > 0 && (
                  <p className="text-xs text-green-600 mt-1">You're saving ${discountAmount}!</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="font-display text-xl mb-4">Payment</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-detroit-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading payment options...</p>
                </div>
              ) : paypalError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4">⚠️</div>
                  <p className="text-red-600 mb-4">{paypalError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-detroit-green text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Lock className="w-4 h-4" />
                    Secure checkout powered by PayPal
                  </div>
                  <div ref={paypalRef} className="min-h-[150px]"></div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    You can pay with PayPal or any major credit/debit card.
                  </p>
                </>
              )}
            </div>

            {/* Guarantee */}
            <div className="mt-6 bg-detroit-green/5 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-2">Our Guarantee</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Museum-quality archival printing</li>
                <li>✓ Professional black frame included</li>
                <li>✓ Hand-signed by the artist</li>
                <li>✓ Ships within 5-7 business days</li>
                <li>✓ 30-day money-back guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
