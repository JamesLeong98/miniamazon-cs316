import Axios from "axios";
import Cookie from "js-cookie";
import {
    ADD_ITEM_CART,
    REMOVE_ITEM_CART,
    TRANSACTION_CREATE_REQUEST,
    TRANSACTION_CREATE_SUCCESS,
    TRANSACTION_CREATE_FAIL, TRANSACTION_LIST_REQUEST, TRANSACTION_LIST_SUCCESS, TRANSACTION_LIST_FAIL, EMPTY_CART
} from "../constants/cartConstants";

const addToCart = (productId, seller, qty) => async (dispatch, getState) => { //addToCart returns async (dispatch, getState)
  try {
      const { userSignin: { userInfo } } = getState();
      const { data } = await Axios.post("/api/sells/cart", {seller: seller, item: productId},
          {headers: {Authorization: ' Bearer ' + userInfo.token},});
      dispatch({//will send action to reducer in cartReducers.js
        type: ADD_ITEM_CART, payload: { //dispatch action type and payload
            product: data.item._id, //bug fix: items replacing each other
            name: data.item.itemName,
            image: data.item.image,
            price: data.price,
            inventory: data.quantity,
            seller: data.seller,
            qty: qty, //number of items in cart for specific product
      }
    });
    //get access to cart items
    const { cart: { cartItems } } = getState();
    //save cart items into the cookie
    Cookie.set("cartItems", JSON.stringify(cartItems), {expires: 1/24});
  } catch (error) {
    //console.log(error);
  }
}

const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({ type: REMOVE_ITEM_CART, payload: productId });
    //remove the items from cookie
    const { cart: { cartItems } } = getState();
   Cookie.set("cartItems", JSON.stringify(cartItems), {expires: 1/24});
}

const createTransaction = (transaction) => async (dispatch, getState) => {
    try {
        dispatch({ type: TRANSACTION_CREATE_REQUEST, payload: transaction });
        const { userSignin: { userInfo } } = getState();
        const { data: { data: newTransaction } } = await Axios.post("/api/transactions", transaction, {
            headers: {
                Authorization: ' Bearer ' + userInfo.token
            }
        });
        dispatch({ type: TRANSACTION_CREATE_SUCCESS, payload: newTransaction });
    } catch (error) {
        alert(error.response.data.message);
        dispatch({ type: TRANSACTION_CREATE_FAIL, payload: error.message });
    }
}

const listTransactions = () => async (dispatch, getState) => {
    try {
        dispatch({ type: TRANSACTION_LIST_REQUEST });
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.get("/api/transactions", {
            headers:
                { Authorization: 'Bearer ' + userInfo.token }
        });
        dispatch({ type: TRANSACTION_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: TRANSACTION_LIST_FAIL, payload: error.message });
    }
}

export { addToCart, removeFromCart, createTransaction, listTransactions}