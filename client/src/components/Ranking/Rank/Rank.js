import React from 'react';
import { RankContainer, RankNumber, RankImage } from './Rank.styles';
import Gold from '../../../assets/gold.svg';
import Silver from '../../../assets/silver.svg';
import Bronze from '../../../assets/bronze.svg';
import Other from '../../../assets/other.svg';

const Rank = ({ rank }) => {
  let gradientId;
  if (rank === 1) {
    gradientId = 'goldGradient';
  } else if (rank === 2) {
    gradientId = 'silverGradient';
  } else if (rank === 3) {
    gradientId = 'bronzeGradient';
  } else {
    gradientId = 'otherGradient';
  }

  return (
    <RankContainer>
        <RankImage 
    src={rank === 1 ? Gold : rank === 2 ? Silver : rank === 3 ? Bronze : Other} 
    alt="Rank" 
  />
        <RankNumber>{rank}</RankNumber>
    </RankContainer>
  );
};

export default Rank;