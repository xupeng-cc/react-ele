import {SET_ADDRESS} from './action-type'

export const setAddress = (payload)=>{
  return {
    type:SET_ADDRESS,
    payload
  }
}