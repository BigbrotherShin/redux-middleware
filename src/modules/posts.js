// posts redux module

/*
프로미스를 다루는 리덕스 모듈을 다룰 땐 다음과 같은 사항을 고려해야합니다.

1.프로미스가 시작, 성공, 실패했을때 다른 액션을 디스패치해야합니다.
2.각 프로미스마다 thunk 함수를 만들어주어야 합니다.
3.리듀서에서 액션에 따라 로딩중, 결과, 에러 상태를 변경해주어야 합니다.
*/

import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기
import {
  reducerUtils,
  handleAsyncActions,
  handleAsyncActionsById,
  createPromiseSaga,
  createPromiseSagaById,
} from '../lib/asyncUtils';
import { takeEvery, getContext } from 'redux-saga/effects';

/* action type */

// checks multiple posts
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';
const GO_TO_HOME = 'GO_TO_HOME';

// 기존에 redux-thunk로 구현 할 때에는 getPosts 와 getPost 는 thunk 함수였는데,
// 이제는 redux-saga를 사용하니까 순수 액션 객체를 반환하는 액션 생성 함수로 구현 할 수 있습니다.
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = id => ({ type: GET_POST, payload: id, meta: id });
export const goToHome = () => ({ type: GO_TO_HOME }); // 순수 액션 객체 반환

const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);
function* goToHomeSaga() {
  const history = yield getContext('history'); // getContext 도 saga effect 중의 하나
  history.push('/'); // 사가 내부에서 history를 사용할 일이 있다면, saga middleware를 만들 때 context에 history를 등록하여 사용
}

// 사가들을 합치기 : action들을 모니터링
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga); // 모든 GET_POSTS 액션에 대하여 getPostsSaga 실행
  yield takeEvery(GET_POST, getPostSaga); // 모든 GET_POST 액션에 대하여 getPostSaga 실행
  yield takeEvery(GO_TO_HOME, goToHomeSaga);
}

// initialState 쪽도 반복되는 코드를 initial() 함수를 사용해서 리팩토링 했습니다.
export const initialState = {
  posts: reducerUtils.initial(),
  post: {},
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, 'posts', true)(state, action);
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActionsById(GET_POST, 'post', true)(state, action);
    default:
      return state;
  }
}
/*
이렇게 표현 할 수도 있답니다.

  case GET_POSTS:
  case GET_POSTS_SUCCESS:
  case GET_POSTS_ERROR:
    const postsReducer = handleAsyncActions(GET_POSTS, 'posts');
    return postsReducer(state, action);
*/
