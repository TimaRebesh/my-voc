import { CustomAvatar } from '../ui/custom-avatar';

export const Avatar = ({
  name,
  avatar,
  size,
}: {
  name: string;
  avatar: string | undefined;
  size?: number;
}) => {
  const getColor = (username: string): string => {
    const firstLetter = username.charAt(0).toLowerCase();
    const colorRanges = [
      { range: ['a', 'e'], color: 'orange' },
      { range: ['f', 'j'], color: 'purple' },
      { range: ['k', 'o'], color: 'green' },
      { range: ['p', 't'], color: 'blue' },
      { range: ['u', 'z'], color: 'red' },
    ];
    const colorRange = colorRanges.find(
      (range) => firstLetter >= range.range[0] && firstLetter <= range.range[1]
    );
    return `bg-${colorRange ? colorRange.color : 'gray'}-500`;
  };

  const avatarFallbackBackground = `text-xl text-white uppercase bg-orange-500 bg-purple-500 bg-red-500 bg-green-500 bg-blue-500 bg-gray-500 ${getColor(name)}`;

  return (
    <CustomAvatar
      src={avatar}
      tooltipText="Open menu"
      fallback={name.charAt(0)}
      className={avatarFallbackBackground}
      size={size}
    />
  );
};
