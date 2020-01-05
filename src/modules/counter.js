// 액션 타입, 액션 생성함수, 리듀서를 한 파일에 작성하는 Ducks 패턴

import { delay, put, takeEvery, takeLatest } from 'redux-saga/effects';

// action type
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_ASYNC = 'INCREASE_ASYNC';
const DECREASE_ASYNC = 'DECREASE_ASYNC';

// function makes action
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });
// 기존 increaseAsync 와 decreaseAsync thunk 함수를 지우고, 일반 액션 생성 함수로 대체
export const increaseAsync = () => ({ type: INCREASE_ASYNC });
export const decreaseAsync = () => ({ type: DECREASE_ASYNC });

function* increaseSaga() {
  yield delay(1000); // wait 1 sec
  yield put(increase()); // put은 특정 액션을 디스패치 해줍니다.
}
function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
}

// 함수들은 액션을 모니터링하는 함수
// takeEvery: 특정 액션 타입에 대하여 디스패치되는 모든 액션들을 처리하는 함수
// takeLatest: 특정 액션 타입에 대하여 디스패치된 가장 마지막 액션만을 처리하는 함수
export function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseSaga); // 모든 INCREASE_AYNC 액션을 처리
  yield takeLatest(DECREASE_ASYNC, decreaseSaga); // 가장 마지막으로 디스패치된 DECREASE_ASYNC 액션만을 처리
}

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
