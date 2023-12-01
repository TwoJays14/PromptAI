'use client';
import { useEffect, useState } from 'react';

import PromptCard from './PromptCard';
import { set } from 'mongoose';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');

  const fetchPosts = async () => {
    const res = await fetch('/api/prompt');
    const data = await res.json();

    setPosts(data);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag.toLowerCase());
  };

  const handleSearchChange = (e) => {
    const searchTextValue = e.target.value.toLowerCase();
    setSearchText(searchTextValue);

    console.log(searchText);
    // fetchPosts();
  };

  useEffect(() => {
    if (!searchText) {
      fetchPosts();
      return;
    }

    const filteredPosts = posts.filter((post) => {
      console.log(post);
      const propertyToMatch = post.prompt.toLowerCase();
      const tagToMatch = post.tag.toLowerCase();
      const usernameToMatch = post.creator.username.toLowerCase();
      return (
        propertyToMatch.includes(searchText) ||
        tagToMatch.includes(searchText) ||
        usernameToMatch.includes(searchText)
      );
    });

    setPosts(filteredPosts);
  }, [searchText]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};
export default Feed;
