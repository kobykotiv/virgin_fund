import { Dialog, DialogContent, DialogOverlay } from "@reach/dialog"
import "@reach/dialog/styles.css"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog isOpen={isOpen} onDismiss={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogContent className="bg-white rounded-md p-6 max-w-md mx-auto">
        {children}
      </DialogContent>
    </Dialog>
  )
}
