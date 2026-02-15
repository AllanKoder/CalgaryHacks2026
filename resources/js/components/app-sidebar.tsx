import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Brain,
    ClipboardList,
    Heart,
    LayoutGrid,
    Lightbulb,
    Users,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { community, dashboard, eventsIndex } from '@/route-helpers';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'My Reflections',
        href: eventsIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Community',
        href: community(),
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'About Reflective Practice',
        href: 'https://en.wikipedia.org/wiki/Reflective_practice',
        icon: BookOpen,
    },
    {
        title: 'Borton\'s Framework',
        href: 'https://en.wikipedia.org/wiki/Terry_Borton',
        icon: Lightbulb,
    },
    {
        title: 'Emotional Intelligence',
        href: 'https://en.wikipedia.org/wiki/Emotional_intelligence',
        icon: Heart,
    },
    {
        title: 'Growth Mindset',
        href: 'https://en.wikipedia.org/wiki/Mindset#Fixed_and_growth_mindset',
        icon: Brain,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
