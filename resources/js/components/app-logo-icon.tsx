import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { src, alt, className, ...rest } = props;
    const mergedClassName = ['object-contain', className].filter(Boolean).join(' ');

    return (
        <img
            src={src ?? '/logo.png'}
            alt={alt ?? 'ReVibe'}
            className={mergedClassName}
            {...rest}
        />
    );
}
