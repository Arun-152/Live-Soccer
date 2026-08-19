import styles from './Skeleton.module.css';

interface SkeletonProps {
  type?: 'card' | 'circle' | 'text';
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton = ({ type = 'text', width, height, className = '' }: SkeletonProps) => {
  const customStyles = {
    width: width || (type === 'text' ? '100%' : type === 'circle' ? '40px' : 'auto'),
    height: height || (type === 'text' ? '1em' : type === 'circle' ? '40px' : '200px'),
    borderRadius: type === 'circle' ? '50%' : '8px',
  };

  return (
    <div 
      className={`${styles.skeleton} ${styles[type]} ${className}`} 
      style={customStyles}
    ></div>
  );
};
