import { type FC, type ReactNode, memo } from 'react';

export interface AppLabelProps {
  /** Icon to display - can be a React node or an image URL */
  icon?: ReactNode | string;
  /** Name of the app/package */
  name: string;
  /** Version string */
  version?: string;
  /** Whether to show the version (default: false) */
  showVersion?: boolean;
  /** Font size in pixels (default: 12) */
  fontSize?: number;
  /** Additional CSS class */
  className?: string;
}

/**
 * AppLabel - Displays an app icon and name with optional version
 */
export const AppLabel: FC<AppLabelProps> = memo(({
  icon,
  name,
  version,
  showVersion = false,
  fontSize = 12,
  className = '',
}) => {
  const iconSize = fontSize * 1.2;

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      // URL string - render as image
      return (
        <img
          src={icon}
          alt={`${name} icon`}
          style={{
            width: iconSize,
            height: iconSize,
            objectFit: 'contain',
          }}
        />
      );
    }

    // React node - render directly
    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: iconSize,
          height: iconSize,
        }}
      >
        {icon}
      </span>
    );
  };

  return (
    <div
      className={`app-label ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: fontSize * 0.4,
        fontSize: `${fontSize}px`,
        color: '#666',
        fontWeight: 400,
      }}
    >
      {renderIcon()}
      <span className="app-label-name">{name}</span>
      {showVersion && version && (
        <span
          className="app-label-version"
          style={{
            opacity: 0.7,
            fontSize: `${fontSize * 0.85}px`,
          }}
        >
          v{version}
        </span>
      )}
    </div>
  );
});

AppLabel.displayName = 'AppLabel';
