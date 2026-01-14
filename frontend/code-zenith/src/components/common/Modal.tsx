import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'lg' | 'xl';
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  children,
  size,
  footer,
}) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onHide}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};
