'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import Link from 'next/link';

const statusConfig: Record<string, string> = {
  pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function MyOrdersPage() {
  const { data, isLoading } = useOrders();
  const orders              = data?.orders || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your purchase history</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-card border border-border rounded-2xl"
          >
            <div className="text-5xl mb-4">📦</div>
            <p className="text-foreground font-semibold mb-2">No orders yet</p>
            <p className="text-muted-foreground text-sm mb-6">Find your dream car and place an order</p>
            <Link href="/cars">
              <Button className="bg-red-600 hover:bg-red-500 text-white">Browse Cars</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any, i: number) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
              >
                {/* Car image */}
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img
                    src={order.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=60'}
                    alt={order.car?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-foreground text-sm truncate">{order.car?.title}</p>
                      <p className="text-red-500 text-xs font-bold mt-0.5">
                        NPR {order.car?.price?.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize shrink-0 ${statusConfig[order.status] || statusConfig.pending}`}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {order.paymentMethod || 'Cash'}
                    </span>
                    <span>
                      Ordered {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {order.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">&quot;{order.notes}&quot;</p>
                  )}
                </div>

                {/* View car */}
                <Link href={`/cars/${order.car?._id}`} className="shrink-0">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View Car
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}