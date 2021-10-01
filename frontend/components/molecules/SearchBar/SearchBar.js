import React from 'react';
import SearchIcon from '_assets/svgs/search_icon.svg';
import CustomButton from '_atoms/CustomButton';

export default function SearchBar() {
  return (
    <form>
      <input className="search-bar-search" />
      <CustomButton imgSrc={SearchIcon} alt="search-bar-icon" type="submit" />
    </form>
  );
}
