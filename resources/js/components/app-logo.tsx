import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center">
                <AppLogoIcon className="size-8 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Reflect
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Reflective Practice
                </span>
            </div>
        </>
    );
}
