import { AnimatePresence, motion } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function BottomSheet({ isOpen, onClose, title, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-zinc-900"
            style={{ maxHeight: "80vh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-zinc-700" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 pt-1">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <button onClick={onClose} className="text-zinc-400 text-sm">닫기</button>
            </div>
            <div className="overflow-y-auto px-5 pb-10">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
