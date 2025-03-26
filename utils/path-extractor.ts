import { usePathname } from "next/navigation"; 
export const generateBreadcrumbs = (path: string) => {

  const segments = path.split('/').filter(segment => segment.length > 0);
  
 
  const breadcrumbs = segments.map((segment, index) => {
    const breadcrumbPath = `/${segments.slice(0, index + 1).join('/')}`;

    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: breadcrumbPath
    };
  });

  return breadcrumbs;
};
