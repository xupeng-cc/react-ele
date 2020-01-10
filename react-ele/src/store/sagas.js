import {getAddress} from '../service/apis'
import {call,put,take,all,fork} from 'redux-saga/effects'

function* getAddressList(){
  
  try{
    let action = yield take("GET_ADDRESS");
    console.log(action)
    const result = yield call(getAddress,action.payload);
    console.log(result)
    yield put({type:"SET_ADDRESS",payload:{addressList:result}});
  }catch(e){
    console.log(e)
    console.log("获取地址失败");
  }
}

function* sagas(){
  console.log("hello sagas")
  // yield takeEvery("getAddress",getAddressList)
  yield all([
    fork(getAddressList)
  ])
}

export default sagas;