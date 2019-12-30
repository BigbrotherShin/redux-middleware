// route reducer :
// 우리는 현재 두가지의 리덕스 모듈을 만들었습니다. 그래서 리듀서도 두개죠. 한 프로젝트에 여러개의 리듀서가 있을때는 이를 한 리듀서로 합쳐서 사용

import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({ counter });

export default rootReducer;