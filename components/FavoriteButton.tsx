'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorite } from '@/app/context/FavoriteContext';
import { Item } from '@/app/context/StyleDataContext';

interface FavoriteButtonProps {
  item: Item;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item }) => {
  const { likedItems, toggleFavorite } = useFavorite();
  const isLiked = likedItems.includes(item.product_id);

  const handleClick = async () => {
    await toggleFavorite(item);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={isLiked ? 'text-red-500 border-red-500' : ''}
    >
      <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
      찜하기
    </Button>
  );
};
