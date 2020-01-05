// route reducer :
// 우리는 현재 두가지의 리덕스 모듈을 만들었습니다. 그래서 리듀서도 두개죠. 한 프로젝트에 여러개의 리듀서가 있을때는 이를 한 리듀서로 합쳐서 사용
// 루트 사가를 만들어주겠습니다. 프로젝트에서 여러개의 사가를 만들게 될텐데, 이를 모두 합쳐서 루트 사가를 만듭니다.

import { combineReducers } from 'redux';
import counter, { counterSaga } from './counter';
import posts from './posts';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({ counter, posts });
export function* rootSaga() {
  yield all([counterSaga()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
}

export default rootReducer;
