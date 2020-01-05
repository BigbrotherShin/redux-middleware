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
} from '../lib/asyncUtils';
import { call, put, takeEvery } from 'redux-saga/effects';

/* action type */

// checks multiple posts
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청 성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

// 기존에 redux-thunk로 구현 할 때에는 getPosts 와 getPost 는 thunk 함수였는데,
// 이제는 redux-saga를 사용하니까 순수 액션 객체를 반환하는 액션 생성 함수로 구현 할 수 있습니다.
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = id => ({ type: GET_POST, payload: id, meta: id });

function* getPostsSaga() {
  try {
    const posts = yield call(postsAPI.getPosts); // call 을 사용하면 특정 함수를 호출하고, 결과물이 반환 될 때까지 기다려줄 수 있습니다.
    yield put({
      type: GET_POSTS_SUCCESS,
      payload: posts,
    }); // 성공 액션 디스패치
  } catch (e) {
    yield put({
      type: GET_POSTS_ERROR,
      error: true,
      payload: e,
    }); // 실패 액션 디스패치
  }
}

// 액션이 지니고 있는 값을 조회하고 싶다면 action을 파라미터로 받아와서 사용할 수 있습니다.
function* getPostSaga(action) {
  const param = action.payload;
  const id = action.meta;
  try {
    const post = yield call(postsAPI.getPostById, param); // API 함수에 넣어주고 싶은 인자는 call 함수의 두번째 인자부터 순서대로 넣어주면 됩니다.
    yield put({
      type: GET_POST_SUCCESS,
      payload: post,
      meta: id,
    });
  } catch (e) {
    yield put({
      type: GET_POST_ERROR,
      error: true,
      payload: e,
      meta: id,
    });
  }
}

// 사가들을 합치기 : action들을 모니터링
export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga); // 모든 GET_POSTS 액션에 대하여 getPostsSaga 실행
  yield takeEvery(GET_POST, getPostSaga); // 모든 GET_POST 액션에 대하여 getPostSaga 실행
}

// 3번째 인자를 사용하면 withExtraArgument 에서 넣어준 값들을 사용 할 수 있습니다.
export const goToHome = () => (dispatch, getState, { history }) => {
  history.push('/');
};

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
