// 액션 타입, 액션 생성함수, 리듀서를 한 파일에 작성하는 Ducks 패턴

// action type
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

// function makes action
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });

// initial value(state doesn't only number, but object)
const initialState = 0;

// reducer
export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return state + 1;
    case DECREASE:
      return state - 1;
    default:
      return state;
  }
}