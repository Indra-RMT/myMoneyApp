import React, { useState } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import classes from './Transaction.css';
import Card from '../UI/Card/Card';
import Container from '../UI/Container/Container';
import { toCommas, unixToMMDDYYYY } from '../../shared/utility';
import Skeleton from '../UI/Skeleton/Skeleton';
import { IconUp, IconDown } from '../UI/Icon/Icon';
import TextFormView from '../UI/TextFormView/TextFormView';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import FormTransaction from '../Home/TransactionHandler/FormTransaction';
import ScrollToTop from '../UI/ScrollToTop/ScrollToTop';

const Transaction = (props) => {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  let initTransactionIcon = <Skeleton height="28px" isAlignRight={true} light />; 
  let initMoney = <Skeleton height="28px" isAlignRight={true} light />;
  let initSkeletonName = <Skeleton height="24px" light />;
  let initSkeletonDate = <Skeleton height="24px" light />;
  let initSkeletonDescription = <Skeleton height="24px" light />;
  let initTransactionOpen = <Skeleton height="24px" light />;

  if (props.transactionDetail) {
    initTransactionIcon = (
      <IconUp 
        hexColor='#718AC9'
        width='32'
        height='32'/>
    )
    if (props.transactionDetail.type === 'spend') {
      initTransactionIcon = (
        <IconDown 
          hexColor='#D05656'
          width='32'
          height='32'/>
      )
    }
    initMoney = toCommas(props.transactionDetail.money);
    initSkeletonName = props.transactionDetail.name;
    initSkeletonDate =  unixToMMDDYYYY(props.transactionDetail.date);
    initSkeletonDescription = props.transactionDetail.description;
    initTransactionOpen = props.transactionDetail.transactionType;
  }

  const btnEditClickedHandler = (event) => {
    setIsModalEditOpen(true);
  }

  const btnDeleteClickHandler = (event) => {
    console.log(event);
  }

  const closeModalHandler = (event) => {
    if (event.key === "Escape") {
      setIsModalEditOpen(false);
      window.removeEventListener('keydown', closeModalHandler);
    }
  }

  if (isModalEditOpen) {
    window.addEventListener('keydown', closeModalHandler);
  }

  const modalHeader = (
    <React.Fragment>
      <div>
        Edit {initTransactionOpen}
      </div>
      <button
        onClick={() => setIsModalEditOpen(false)}>X</button>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {/* <ScrollToTop /> */}
      <div className={classes.Transaction}>
        <div className={classes.Highlight}>
          <Container>
            <div className={classes.CardHighlightWrapper}>
              <Card type="Hightlight">
                <div className={classes.TransactionIcon}>
                  {initTransactionIcon}
                </div>
                <div className={classes.Money}>
                  {initMoney}
                </div>
              </Card>
            </div>
          </Container>
        </div>
        <div className={classes.TransactionInfo}>
          <Container>
            <Card type="TransactionInfo">
              <TextFormView
                label="For">
                {initSkeletonName}
              </TextFormView>
              <TextFormView
                label="Date">
                {initSkeletonDate}
              </TextFormView>
              <TextFormView
                label="Description">
                {initSkeletonDescription}
              </TextFormView>
              <div className={classes.ButtonWrapper}>
                <Button 
                  btnType="Secondary"
                  disabled={!props.transactionDetail}
                  clicked={btnEditClickedHandler}>Edit</Button>
                <Button
                  btnType="Danger"
                  disabled={!props.transactionDetail}
                  clicked={btnDeleteClickHandler}>Delete</Button>
              </div>
            </Card>
          </Container>
        </div>
      </div>
      <Modal
        show={isModalEditOpen}
        styleTop="8%"
        styleWidth="90%"
        modalHeader={modalHeader}
        modalClosed={() => setIsModalEditOpen(false)}>
          <FormTransaction 
            transactionOpen={'Income'}
            show={isModalEditOpen}
            transactionType="Edit"
            transactionData={props.transactionDetail}/>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    transactionDetail: state.trans.transactionDetail
  };
};

export default connect(mapStateToProps)(Transaction);