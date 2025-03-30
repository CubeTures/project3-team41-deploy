import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	BookOpenText,
	BookText,
	ChevronRight,
	Clock,
	CupSoda,
	Pencil,
	Store,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ValidateLinkOptions } from "@tanstack/react-router";
import { Fragment, ReactElement } from "react";
import UnicornLogo from "@/assets/PFU.jpg";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface Group {
	group: string;
	buttons?: Button[];
	collapsible?: Collapse[];
}

interface Button {
	button: string;
	icon: ReactElement;
	link: ValidateLinkOptions;
}

interface Collapse {
	collapse: string;
	icon: ReactElement;
	pages: Page[];
}

interface Page {
	page: string;
	link: ValidateLinkOptions;
}

const groups: Group[] = [
	{
		group: "Customer",
		buttons: [
			{
				button: "Kiosk",
				icon: <Store />,
				link: { to: "/kiosk" },
			},
		],
	},
	{
		group: "Employee",
		buttons: [
			{
				button: "Order",
				icon: <CupSoda />,
				link: { to: "/order" },
			},
			{
				button: "Display Menu",
				icon: <BookOpenText />,
				link: { to: "/display" },
			},
			{
				button: "Transaction History",
				icon: <Clock />,
				link: { to: "/history" },
			},
		],
	},
	{
		group: "Manager",
		collapsible: [
			{
				collapse: "Edit",
				icon: <Pencil />,
				pages: [
					{
						page: "Menu",
						link: { to: "/edit/menu" },
					},
					{
						page: "Inventory",
						link: { to: "/edit/inventory" },
					},
					{
						page: "Employees",
						link: { to: "/edit/employees" },
					},
				],
			},
			{
				collapse: "Report",
				icon: <BookText />,
				pages: [
					{
						page: "Profit Over Time",
						link: { to: "/report/profit" },
					},
					{
						page: "Top Selling Items",
						link: { to: "/report/items" },
					},
					{
						page: "X Report",
						link: { to: "/report/x" },
					},
					{
						page: "Z Report",
						link: { to: "/report/z" },
					},
				],
			},
		],
	},
];

interface Props {
	children: ReactElement;
}

function AppSidebar({ children }: Props) {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	if (currentPath == "/") {
		return children;
	}

	function Header() {
		return (
			<div className="flex gap-4 items-center">
				<img
					src={UnicornLogo}
					className="rounded"
					height={36}
					width={36}
				/>
				<h1>Pink Fluffy Unicorns</h1>
			</div>
		);
	}

	function Breadcrumbs() {
		const breadcrumbs = getBreadcrumbs();

		return (
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((str, index) => (
						<Fragment key={`${str}-${index}`}>
							{index !== 0 && (
								<BreadcrumbSeparator className="hidden md:block" />
							)}
							<BreadcrumbItem className="hidden md:block">
								{index === breadcrumbs.length - 1 ? (
									<BreadcrumbPage>{str}</BreadcrumbPage>
								) : (
									str
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		);
	}

	function getBreadcrumbs(): string[] {
		for (const group of groups) {
			if (group.buttons) {
				for (const button of group.buttons) {
					if (button.link.to == currentPath) {
						return [group.group, button.button];
					}
				}
			}
			if (group.collapsible) {
				for (const collapse of group.collapsible) {
					for (const page of collapse.pages) {
						if (page.link.to == currentPath) {
							return [group.group, collapse.collapse, page.page];
						}
					}
				}
			}
		}

		return [];
	}

	function AppSidebarGroup({ group, buttons, collapsible }: Group) {
		return (
			<SidebarGroup key={group}>
				<SidebarGroupLabel>{group}</SidebarGroupLabel>
				{buttons && (
					<SidebarMenu>{buttons.map(AppSidebarButton)}</SidebarMenu>
				)}
				{collapsible && (
					<SidebarMenu>
						{collapsible.map(AppSidebarCollapsible)}
					</SidebarMenu>
				)}
			</SidebarGroup>
		);
	}

	function AppSidebarButton({ button, icon, link }: Button) {
		return (
			<SidebarMenuItem key={button}>
				<SidebarMenuButton
					asChild
					isActive={currentPath == link.to}
				>
					<Link {...link}>
						{icon}
						<span>{button}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	function AppSidebarCollapsible({ collapse, icon, pages }: Collapse) {
		return (
			<Collapsible
				key={collapse}
				asChild
				defaultOpen={pages.some(({ link }) => link.to == currentPath)}
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton tooltip={collapse}>
							{icon}
							<span>{collapse}</span>
							<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{pages.map(AppSidebarPage)}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		);
	}

	function AppSidebarPage({ page, link }: Page) {
		return (
			<SidebarMenuSubItem key={page}>
				<SidebarMenuSubButton
					asChild
					isActive={currentPath == link.to}
				>
					<Link {...link}>{page}</Link>
				</SidebarMenuSubButton>
			</SidebarMenuSubItem>
		);
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>{Header()}</SidebarHeader>
				<SidebarContent>{groups.map(AppSidebarGroup)}</SidebarContent>
			</Sidebar>
			<SidebarInset className="overflow-hidden">
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 h-4"
						/>
						{Breadcrumbs()}
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}

export default AppSidebar;
