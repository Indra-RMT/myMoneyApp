import React, {useState} from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import classes from './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) => {
  const [modalContent, setModalContent] = useState(false);
  const [modalHeader, setModalHeader] = useState(false);

  const animationTiming = {
    enter: 400,
    exit: 600
  };
  
  if (props.show && props.children !== modalContent) {
    setModalContent(props.children);
  }

  if (props.show && props.modalHeader !== modalHeader) {
    setModalHeader(props.modalHeader);
  }

  const setModalStyle = (styleTop, styleWidth) => {
    const modalStyleTop = styleTop ? {top: styleTop} : {top: '30%'};
    const modalStyleWidth = styleWidth ? {width: styleWidth} : {width: '70%'};
    return {...modalStyleTop, ...modalStyleWidth}
  }

  let isHeaderModalFilled = {display: "none"};
  if (modalHeader) {
    isHeaderModalFilled = {display: "block"};
  }

  return (
    <div id="Modal">
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={props.show}
        timeout={animationTiming}
        classNames={{
          enter: '',
          enterActive: classes.ModalOpen,
          exit: '',
          exitActive: classes.ModalClosed,
        }}>
          <div className={classes.Modal} style={setModalStyle(props.styleTop, props.styleWidth)}>
            <div className={classes.ModalHeaderWrapper} style={isHeaderModalFilled}>
              <div className={classes.ModalHeader}>
                {modalHeader}
              </div>
            </div>
            <div className={classes.ModalBody}>
              {modalContent}
            </div>
          </div>
      </CSSTransition>
    </div>
  )
}

export default Modal;