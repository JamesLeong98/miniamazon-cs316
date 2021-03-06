import Axios from "axios";
import Cookies from 'js-cookie';
import {
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_UPDATE_BALANCE_REQUEST,
  USER_UPDATE_BALANCE_FAIL,
  USER_LOGOUT,
  USER_GET_BALANCE_REQUEST
} from "../constants/userConstants";
import axios from "axios";

const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post("/api/users/signin", { email, password });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    Cookies.set('userInfo', JSON.stringify(data), { expires: 1/24 }); //if you close web app, data will be stored in browser cookie, expires in 1 hour
  } catch (error) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: error.message });
  }
}

const register = (fullName, username, email, password, isSeller) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { fullName, username, email, password, isSeller } });
  try {
    const { data } = await Axios.post("/api/users/register", { fullName, username, email, password, isSeller });
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    Cookies.set('userInfo', JSON.stringify(data), { expires: 1/24 }); //cookie expires in 1 hour
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
}

const logout = () => (dispatch) => {
  Cookies.remove("userInfo");
  Cookies.remove("cartItems");
  dispatch({ type: USER_LOGOUT })
}

export { signin, register, logout };

export const detailsUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/users/${userId}`, {
      headers: { Authorization: `${userInfo.token}` },
    });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_DETAILS_FAIL, payload: message });
  }
};

export const getUserBalance = () => async (dispatch, getState) => {
  try {
    dispatch({type: USER_GET_BALANCE_REQUEST});
    const { userSignin: { userInfo } } = getState();
    const { data } = await axios.get("/api/users/balance", {headers:
          { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    Cookies.set('userInfo', JSON.stringify(data));
  } catch {
    return;
  }
}

export const updateUserBalance = (topUp) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_BALANCE_REQUEST, payload: topUp });
  const {userSignin: { userInfo }} = getState();
  try {
    const { data } = await Axios.put(`/api/users/balance`, {topUp: Number(topUp)}, {headers:
          { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    Cookies.set('userInfo', JSON.stringify(data), { expires: 1/24 });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPDATE_BALANCE_FAIL, payload: message });
  }
};