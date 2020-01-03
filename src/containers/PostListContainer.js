import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostList from '../components/PostList';
import { getPosts } from '../modules/posts';


// 포스트 목록이 재로딩 되는 문제를 해결하는 방법은 두가지가 있습니다.
// 첫번째는 만약 데이터가 이미 존재한다면 요청을 하지 않도록 하는 방법
// 이렇게 하고나면 포스트 목록이 이미 있는데 재로딩하는 이슈를 수정 할 수 있습니다.
function PostListContainer() {
  const { data, loading, error } = useSelector(state => state.posts.posts);
  const dispatch = useDispatch();

  // 컴포넌트 마운트 후 포스트 목록 요청
  useEffect(() => {
    if (data) return;
    dispatch(getPosts());
  }, [data, dispatch]);

  if (loading && !data) return <div>로딩중...</div>; // 로딩중이면서, 데이터가 없을 때에만 로
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;
  return <PostList posts={data} />;
}

export default PostListContainer;
