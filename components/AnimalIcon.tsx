import React from 'react';
import { IconType } from 'react-icons';
import { FaCat, FaHippo, FaHorseHead, FaRunning, FaDove, FaQuestionCircle, FaPaw } from 'react-icons/fa';
// Add more specific icons if available or as placeholders
// Example: import { GiLion } from 'react-icons/gi';

interface AnimalIconProps {
  iconKey: string;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: { [key: string]: IconType } = {
  FaCat: FaCat, // Tiger proxy
  FaHippo: FaHippo, // Elephant proxy
  FaHorseHead: FaHorseHead,
  FaPersonRunning: FaRunning, // Deer proxy
  FaDove: FaDove, // Peacock proxy
  FaLion: FaPaw, // Using FaPaw as Lion proxy, replace if better icon like GiLion is used
  Default: FaQuestionCircle,
};

const AnimalIcon: React.FC<AnimalIconProps> = ({ iconKey, className, style }) => {
  const IconComponent = iconMap[iconKey] || iconMap.Default;
  return <IconComponent className={className} style={style} aria-hidden="true" />;
};

export default AnimalIcon;
