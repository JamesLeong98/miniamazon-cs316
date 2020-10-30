import { PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_SAVE_REQUEST,
    PRODUCT_SAVE_SUCCESS,
    PRODUCT_SAVE_FAIL, SELLER_LIST_FAIL, SELLER_LIST_REQUEST, SELLER_LIST_SUCCESS} from "../constants/productConstants";

function productListReducer(state={products:[]}, action){
    switch(action.type){
        //sending request to server to get list of products
        case PRODUCT_LIST_REQUEST: 
            return {loading:true}; //show variable loading true if successful
        case PRODUCT_LIST_SUCCESS:
            //actions are payloads that send data from application to store
            return {loading:false, products: action.payload};
        case PRODUCT_LIST_FAIL:
            return {loading:false, error: action.payload};
        default:
            return state;
    }
}

function productDetailsReducer(state={product:{}}, action){
    switch(action.type){
        //sending request to server to get list of products
        case PRODUCT_DETAILS_REQUEST: 
            return {loading:true}; //show variable loading true if successful
        case PRODUCT_DETAILS_SUCCESS:
            //actions are payloads that send data from application to store
            return {loading:false, product: action.payload};
        case PRODUCT_DETAILS_FAIL:
            return {loading:false, error: action.payload};
        default:
            return state;
    }
}

function productSaveReducer(state = { product: {} }, action) {
    switch (action.type) {
      case PRODUCT_SAVE_REQUEST:
        return { loading: true };
      case PRODUCT_SAVE_SUCCESS:
        return { loading: false, success: true, product: action.payload };
      case PRODUCT_SAVE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  }

  function sellerListReducer(state={products:[]}, action){
    switch(action.type){
        //sending request to server to get list of seller
        case SELLER_LIST_REQUEST: 
            return {loading:true}; //show variable loading true if successful
        case SELLER_LIST_SUCCESS:
            //actions are payloads that send data from application to store
            return {loading:false, products: action.payload};
        case SELLER_LIST_FAIL:
            return {loading:false, error: action.payload};
        default:
            return state;
    }
}
export {sellerListReducer, productListReducer, productDetailsReducer, productSaveReducer}