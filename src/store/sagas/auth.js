import { delay } from 'redux-saga/effects';
import { put, call } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

export function* logoutSaga(action) {
  yield call([localStorage, 'removeItem'], "token");
  yield call([localStorage, 'removeItem'], "expirationDate");
  yield call([localStorage, 'removeItem'], "userId");
  yield put(actions.logoutSucceed())
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
} 

export function* authUserSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  }
  let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyASuC71-1G2HZL651G-SnqREqDGN4nETUs';
  if (!action.isSignup) {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyASuC71-1G2HZL651G-SnqREqDGN4nETUs';
  }
  try {
    const response = yield axios.post(url, authData);

    if (!action.isSignup) {
      const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
      yield localStorage.setItem('token', response.data.idToken);
      yield localStorage.setItem('expirationDate', expirationDate);
      yield localStorage.setItem('userId', response.data.localId);
      yield put(actions.authSuccess(response.data.idToken, response.data.localId));
      yield put(actions.checkAuthTimeout(response.data.expiresIn));
      yield put(actions.setSignupStatus(false));
    }

    if (action.isSignup) {
      yield put(actions.authSuccess(response.data.idToken, response.data.localId));
      yield put(actions.setSignupStatus(true));
    }    
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
    yield put(actions.setSignupStatus(false));
    // console.log(error);
  }
}

export function* authCheckStateSaga() {
  const token = yield localStorage.getItem('token');
  if (!token) {
    yield put(actions.logout())
  } else {
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem('userId'); 
      yield put(actions.authSuccess(token, userId));
      yield put(
        actions.checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
}