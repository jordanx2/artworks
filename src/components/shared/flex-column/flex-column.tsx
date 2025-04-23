import React from 'react';
import styles from './flex-column.module.scss';
import classNames from 'classnames';

interface FlexColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg' | 'none';
  wrap?: boolean;
  children: React.ReactNode;
}

const FlexColumn: React.FC<FlexColumnProps> = ({
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  children,
  className,
  ...rest
}) => {
  const columnClass = classNames(
    styles.flexColumn,
    styles[`align-${align}`],
    styles[`justify-${justify}`],
    styles[`gap-${gap}`],
    { [styles.wrap]: wrap },
    className
  );

  return (
    <div className={columnClass} {...rest}>
      {children}
    </div>
  );
};

export default FlexColumn;
