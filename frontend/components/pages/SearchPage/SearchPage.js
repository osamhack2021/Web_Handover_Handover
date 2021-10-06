import React from 'react';
import { useParams } from 'react-router';

export default function SearchPage() {
  const { searchQuery } = useParams();
  return (
    <div>
      {searchQuery}
    </div>
  );
}
