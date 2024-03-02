import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai';

import { useQuery } from '@apollo/client';
import { getUserPoint } from '../graphql/getUserPoints';
import { NFTContext } from '../context/NFTContext';

const Points = ({ onClick }) => {
  const { currentAccount, userPoint, setUserPoint } = useContext(NFTContext);

  useEffect(() => {
    const handleUserPoints = async () => {
      console.log('Master', currentAccount);
      try {
        const points = await getUserPoint(currentAccount);

        console.log('User points loaded:', points);
        setUserPoint(points);
      } catch (error) {
        console.log('Error loading user points:', error);
      }
    };
    handleUserPoints();
  }, [currentAccount]);

  return (
    <div className="points-block" onClick={onClick}>
      <AiOutlineStar style={{ fontSize: 20 }} />
      <span className="">{userPoint}</span>
    </div>
  );
};

export default Points;
