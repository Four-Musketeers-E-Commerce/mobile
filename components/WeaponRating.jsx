import StarRating from 'react-native-star-rating-widget';

const WeaponRating = ({ rating, setRating }) => {
  return (
      <StarRating
        rating={rating} 
        onChange={setRating}
      />
  );
};

export default WeaponRating;
