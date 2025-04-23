import React from 'react';
import styles from './flex-row.module.scss';
import classNames from 'classnames';

interface FlexRowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg' | 'none';
  wrap?: boolean;
  children: React.ReactNode;
}

const FlexRow: React.FC<FlexRowProps> = ({
  align = 'center',
  justify = 'start',
  gap = 'md',
  wrap = false,
  children,
  className,
  ...rest
}) => {
  const rowClass = classNames(
    styles.flexRow,
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    styles[`gap-${gap}`],
    { [styles.wrap]: wrap },
    className
  );

  return (
    <div className={rowClass} {...rest}>
      {children}
    </div>
  );
};

export default FlexRow;
