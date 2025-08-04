export const generateRandomAvatar = (): string => {
  const avatars = [
    '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🔧', '👨‍🔧', '👩‍🔧',
    '🧑‍🚗', '👨‍🚗', '👩‍🚗', '🧑‍🏭', '👨‍🏭', '👩‍🏭',
  ];
  
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};