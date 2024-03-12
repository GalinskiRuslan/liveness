import { useMount } from "@/hooks";
import Portal from "@/lib/Portal";
import Layout from "./Layout/Layout";

interface ModalProps {
  size: "sm" | "lg" | "xl";
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ size, isOpen, onClose, children }: ModalProps) => {
  const { isMounted } = useMount(isOpen);

  if (!isMounted) {
    return null;
  }

  return (
    <Portal>
      <Layout size={size} isOpen={isOpen} onClose={onClose}>
        {children}
      </Layout>
    </Portal>
  );
};

export default Modal;
