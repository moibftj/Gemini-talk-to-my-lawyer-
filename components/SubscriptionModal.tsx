import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './Card';
import { ShimmerButton } from './magicui/shimmer-button';
import { IconDollarSign, IconStar } from '../constants';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ open, onClose, onSubscribe }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-2xl bg-white/95 dark:bg-slate-900/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Upgrade to Generate Letters
                </CardTitle>
                <CardDescription>Subscribe to unlock attorney-reviewed letter generation.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
                  <li>Unlimited AI-assisted legal letter drafts</li>
                  <li>Attorney review and approval workflow</li>
                  <li>PDF export and email delivery</li>
                  <li>Access to all templates</li>
                </ul>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Basic", "Pro", "Elite"].map((tier, i) => (
                    <div key={tier} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tier}</span>
                        {i === 1 && (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <IconStar className="w-4 h-4" /> Popular
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-2xl font-bold">{i === 0 ? "$9" : i === 1 ? "$19" : "$39"}<span className="text-sm font-normal">/mo</span></div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</button>
                <ShimmerButton onClick={onSubscribe}>Subscribe Now</ShimmerButton>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
