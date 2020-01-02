// 미들웨어는 결국 하나의 함수입니다. 함수를 연달아서 두번 리턴하는 함수

// 리덕스 미들웨어를 만들 땐 다음 템플릿을 사용

const myLogger = store => next => action => {
  console.log(action); // ouputs current action
  const result = next(action); // gives a action to next middleware or reducer

  // checks state after update
  console.log('\t', store.getState()) // '\t' 는 탭 문자 입니다.

  return result; // return value is result of dispatch(action). default: undefined
};

/* 
이 함수를 function 키워드를 사용하여 작성한다면 다음과 같습니다.

function middleware(store) {
  return function (next) {
    return function (action) {
      // 하고 싶은 작업...
    };
  };
};
*/

export default myLogger;

// 지금은 단순히 전달받은 액션을 출력하고 다음으로 넘기는 작업을 구현
