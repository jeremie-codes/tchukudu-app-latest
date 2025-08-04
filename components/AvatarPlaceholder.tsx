import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarPlaceholderProps {
  name: string;
  avatar?: string;
  size?: number;
}

export default function AvatarPlaceholder({ name, avatar, size = 40 }: AvatarPlaceholderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (avatar) {
    return (
      <Image
        source={{ uri: avatar }}
        style={{ width: size, height: size }}
        className="rounded-full"
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size }}
      className={`rounded-full items-center justify-center ${getBackgroundColor(name)}`}
    >
      <Text 
        style={{ fontSize: size * 0.4 }}
        className="text-white font-montserrat-bold"
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}