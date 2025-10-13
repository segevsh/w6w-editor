import { type FC, type CSSProperties } from 'react';

export interface RectangleProps {
  /**
   * Width of the rectangle in pixels
   */
  width?: number;
  /**
   * Height of the rectangle in pixels
   */
  height?: number;
  /**
   * Fill color of the rectangle
   */
  fill?: string;
  /**
   * Stroke color of the rectangle border
   */
  stroke?: string;
  /**
   * Stroke width in pixels
   */
  strokeWidth?: number;
  /**
   * Border radius in pixels
   */
  borderRadius?: number;
  /**
   * Optional label text to display inside the rectangle
   */
  label?: string;
  /**
   * Label text color
   */
  labelColor?: string;
  /**
   * Label font size in pixels
   */
  labelSize?: number;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the element is selected
   */
  selected?: boolean;
}

/**
 * Rectangle - A basic rectangular workflow element component
 *
 * @example
 * ```tsx
 * <Rectangle
 *   width={200}
 *   height={100}
 *   fill="#ffffff"
 *   stroke="#0066cc"
 *   label="Process Step"
 * />
 * ```
 */
export const Rectangle: FC<RectangleProps> = ({
  width = 200,
  height = 100,
  fill = '#ffffff',
  stroke = '#0066cc',
  strokeWidth = 2,
  borderRadius = 8,
  label,
  labelColor = '#333333',
  labelSize = 14,
  onClick,
  className = '',
  selected = false,
}) => {
  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: fill,
    border: `${strokeWidth}px solid ${stroke}`,
    borderRadius: `${borderRadius}px`,
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    boxShadow: selected ? '0 0 0 2px rgba(0, 102, 204, 0.5)' : 'none',
    transition: 'box-shadow 0.2s ease',
  };

  const labelStyle: CSSProperties = {
    color: labelColor,
    fontSize: `${labelSize}px`,
    fontWeight: 500,
    textAlign: 'center',
    padding: '8px',
    wordBreak: 'break-word',
  };

  return (
    <div
      className={`w6w-rectangle ${className}`}
      style={containerStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};
